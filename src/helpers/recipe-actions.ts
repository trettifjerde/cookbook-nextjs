'use server'

import { cookies } from "next/headers";
import { addItemsToUserMongoList, fromMongoToRecipePreview, queryDB, verifyToken } from "./server-helpers";
import { ErrorCodes, FormRecipe, Ingredient, MongoRecipe, PreUploadFormRecipe, RecipeIngredient, RecipePreview, ServerActionResponseWithData } from "./types";
import { Collection, ObjectId } from "mongodb";
import { revalidateTag } from "next/cache";
import { INIT_RECIPES_TAG, RECIPE_PREVIEW_BATCH_SIZE } from "./config";
import { initRecipePreviews } from "./init-recipe-cache";
import { validateRecipe } from "./forms";

type Command = 'add'|'update'|'skip';
type Instruction = {command: 'add', preview: RecipePreview} | {command: 'update', preview: RecipePreview} | {command: 'skip', id: string};
export type RecipeFormState = {id: string, status: ErrorCodes} | 
    {id: string, status: 200, instruction: Instruction} |
    {id: string, status: 0};

export async function sendRecipe(state: RecipeFormState, formData: FormData) : Promise<RecipeFormState>{
    const authorId = verifyToken(cookies(), 'sendRecipe server action');
    const id = state.id;

    if (!authorId)
        return {id, status: 401};

    const {data: preUploadRecipe, errors: recipeErrors} = validateRecipe(formData);

    console.log('preupload', preUploadRecipe);

    if (recipeErrors)
        return {id, status: 400};

    let command : Command;
    let recipeFn : (recipe: MongoRecipe, col: Collection<MongoRecipe>) => Promise<boolean>;

    if (id) {
        recipeFn = updateRecipe;
        command = 'update';
    }
    else {
        recipeFn = addRecipe;
        command = 'add';
    }

    const {mongoRecipe, uploadError} = await uploadImageAndUpdateRecipe({recipe: preUploadRecipe, authorId, id});

    if (uploadError) 
        return {id, status: 503}

    const recipeId = mongoRecipe._id.toString();
    const res = await queryDB<MongoRecipe, boolean>('recipes', async (col) => recipeFn(mongoRecipe, col));

    if (res === null)
        return {id, status: 500};

    if (!res)
        return {id, status: 400};

    let instruction : Instruction;

    const initPreviews = await initRecipePreviews();

    if (initPreviews.previews.length < RECIPE_PREVIEW_BATCH_SIZE || initPreviews.previews.some(p => p.id === recipeId)) {
        console.log(`revalidating tag ${INIT_RECIPES_TAG}`);
        revalidateTag(INIT_RECIPES_TAG);
        instruction = {command: 'skip', id: recipeId};
    }
    else 
        instruction = {command, preview: fromMongoToRecipePreview(mongoRecipe)};

    revalidateTag(recipeId);
    console.log('revalidating tag', recipeId);

    return {id, status: 200, instruction};
}

export async function toShoppingListAction(ings: RecipeIngredient[]) : Promise<ServerActionResponseWithData<Ingredient[]>> {
    const userId = verifyToken(cookies(), 'to Shopping List Action');
    if (!userId)
        return {status: 401};

    const response = await addItemsToUserMongoList(userId, ings);
    if (!response)
        return {status: 500};

    return {status: 200, data: response};
}

async function updateRecipe(recipe: MongoRecipe, col: Collection<MongoRecipe>) : Promise<boolean> {

    const response = await col.replaceOne({_id: recipe._id, authorId: recipe.authorId}, recipe);
    return (response.acknowledged && response.modifiedCount === 1)
}

async function addRecipe(recipe: MongoRecipe, col: Collection<MongoRecipe>) : Promise<boolean> {

    const response = await col.insertOne(recipe);
    return response.acknowledged;
}

async function uploadImageAndUpdateRecipe({recipe, authorId, id} : {recipe: PreUploadFormRecipe, authorId: string, id: string}) {
    const {imagePath, imageFile, ...rest} = recipe;

    const mongoRecipe : MongoRecipe = {
        ...rest, 
        _id: new ObjectId(id || undefined),
        authorId: new ObjectId(authorId),
        imagePath: imagePath || undefined
    };

    if (imageFile) {

        const imgBBData = new FormData();
        imgBBData.append('key', process.env.IMG_BB_KEY!);
        imgBBData.append('image', imageFile);
        imgBBData.append('expiration', (60 * 60 * 24 * 30 * 3).toString());

        const imgUrl = await fetch(process.env.IMG_BB_UPLOAD_URL!, {
            method: 'POST',
            body: imgBBData
        })
        .then(res => res.json())
        .then(res => {
            if (res.error)
                throw new Error(res.error.message);
            return res.data.display_url;
        })
        .catch(error => {
            console.log('Error uploading image file to imgbb', error);
            return null;
        });

        if (!imgUrl)
            return {mongoRecipe, uploadError: true};

        mongoRecipe.imagePath = imgUrl;
    }

    return {mongoRecipe, uploadError: false};
}