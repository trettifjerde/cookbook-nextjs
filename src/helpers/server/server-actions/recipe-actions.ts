'use server'

import { Collection, ObjectId, WithId } from "mongodb";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { INIT_RECIPE_PREVS_TAG, RECIPE_PREVIEW_BATCH_SIZE, RECIPES_COLLECTION } from "@/helpers/config";
import { fetchInitPreviews } from "@/helpers/fetchers";
import { validateRecipe } from "@/helpers/client/validators/forms";
import { ErrorCodes, Ingredient, MongoRecipe, RecipeIngredient, ServerActionResponse, ServerActionResponseWithData } from '../../types'
import getUserId from "../cachers/token";
import { dbCol } from "../db/controller";
import { addItemsToUserMongoList, readInitPreviews } from "../db/queries";
import { uploadImageAndUpdateRecipe } from "../actions";

export async function sendRecipe({formData, id}: {formData: FormData, id?: string}) : Promise<ErrorCodes> {
    const authorId = getUserId();
    
    if (!authorId)
        return 401;

    const {data: preUploadRecipe, errors: recipeErrors} = validateRecipe(formData);

    if (recipeErrors)
        return 400;
    
    const {mongoRecipe, uploadError} = await uploadImageAndUpdateRecipe({recipe: preUploadRecipe, authorId, id});
    if (uploadError) 
        return 503;
    
    const recipeId = mongoRecipe._id.toString();
    console.log('querying db: sending recipe');
    const recipeFn = id ? updateRecipe : addRecipe;

    const {ok, result} = await dbCol(RECIPES_COLLECTION, (col: Collection<MongoRecipe>) => recipeFn(mongoRecipe, col));

    if (!ok)
        return 500;

    if (!result)
        return 400;

    console.log('checking if recipe is in prevs');
    const initPrevs = await fetchInitPreviews();
    if (!initPrevs.ok)
        return 500;

    const {previews} = initPrevs.data;

    if (previews.length < RECIPE_PREVIEW_BATCH_SIZE || previews.some(p => p.id === recipeId)) {
        console.log('revalidating init prev tag');
        revalidateTag(INIT_RECIPE_PREVS_TAG);
    }

    revalidateTag(recipeId);
    console.log('revalidating tag', recipeId);

    redirect(`/recipes/${recipeId}`);
}

export async function deleteRecipeAction(recipeId: string): Promise<ErrorCodes | 200> {
    const userId = getUserId();

    if (!userId)
        return 401;

    console.log('querying db: deleting recipe', recipeId);

    const { ok, result } = await dbCol(
        RECIPES_COLLECTION, 
        (col: Collection<MongoRecipe>) => col
            .deleteOne({_id: new ObjectId(recipeId), authorId: new ObjectId(userId)})
    );

    if (!ok) 
        return 500;

    if (!result.acknowledged || result.deletedCount !== 1)
        return 404;

    const prevs = await readInitPreviews();

    if (!prevs.ok)
        return 500;

    if (prevs.result.some(p => p.id === recipeId)) {
        console.log('revalidating init prev tag');
        revalidateTag(INIT_RECIPE_PREVS_TAG);
        redirect('/recipes');
    }
    else {
        setTimeout(() => revalidateTag(recipeId), 0);
        return 200;
    }
}

export async function toShoppingListAction(ings: RecipeIngredient[]) : Promise<ServerActionResponseWithData<Ingredient[]>> {
    const userId = getUserId();

    if (!userId)
        return {status: 401};

    const {ok, result} = await addItemsToUserMongoList(userId, ings);
    
    if (!ok)
        return {status: 500};

    return {status: 200, data: result};
}

async function updateRecipe(recipe: WithId<MongoRecipe>, col: Collection<MongoRecipe>) : Promise<boolean> {

    const response = await col.replaceOne({_id: recipe._id, authorId: recipe.authorId}, recipe);
    return (response.acknowledged && response.modifiedCount === 1)
}

async function addRecipe(recipe: MongoRecipe, col: Collection<MongoRecipe>) : Promise<boolean> {

    const response = await col.insertOne(recipe);
    return response.acknowledged;
}