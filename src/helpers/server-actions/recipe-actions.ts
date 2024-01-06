'use server'

import { Collection, ObjectId } from "mongodb";
import { revalidateTag } from "next/cache";
import { ErrorCodes, Ingredient, MongoRecipe, RecipeIngredient, RecipePreview, ServerActionResponse, ServerActionResponseWithData } from "../types";
import { INIT_RECIPES_TAG, RECIPE_PREVIEW_BATCH_SIZE } from "../config";
import { validateRecipe } from "../forms";
import { fromMongoToRecipePreview } from "../casters";
import getUserId from "../cachers/token";
import { addItemsToUserMongoList, queryDB } from "../db-controller";
import { uploadImageAndUpdateRecipe } from "../server-helpers";
import { fetchInitPreviews } from "../fetchers";

type Command = 'add'|'update'|'skip';
type Instruction = {command: 'add', preview: RecipePreview} | {command: 'update', preview: RecipePreview} | {command: 'skip', id: string};
export type RecipeFormState = {id: string, status: ErrorCodes} | 
    {id: string, status: 200, instruction: Instruction} |
    {id: string, status: 0};

export async function sendRecipe(state: RecipeFormState, formData: FormData) : Promise<RecipeFormState>{
    const authorId = getUserId();
    const id = state.id;

    if (!authorId)
        return {id, status: 401};

    const {data: preUploadRecipe, errors: recipeErrors} = validateRecipe(formData);

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

    const initPreviews = await fetchInitPreviews();

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

export async function deleteRecipeAction(recipeId: string) : Promise<ServerActionResponse> {
    const userId = getUserId();

    if (!userId)
        return {status: 401};

    console.log('querying db: deleting recipe', recipeId);

    const response = await queryDB<MongoRecipe, boolean>('recipes', async (col) => {
        const result = await col.deleteOne({_id: new ObjectId(recipeId), authorId: new ObjectId(userId)});
        return result.acknowledged && result.deletedCount === 1;
    });

    if (response === null)
        return {status: 500};

    if (!response)
        return {status: 404};

    const initRecipes = await fetchInitPreviews();
    if (initRecipes.previews.some(p => p.id === recipeId)) 
        revalidateTag(INIT_RECIPES_TAG);

    revalidateTag(recipeId);
    
    return {status: 200};
}

export async function toShoppingListAction(ings: RecipeIngredient[]) : Promise<ServerActionResponseWithData<Ingredient[]>> {
    const userId = getUserId();

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