import { fromMongoToRecipe } from "@/helpers/casters";
import { INIT_RECIPES_TAG } from "@/helpers/config";
import { initRecipePreviews } from "@/helpers/init-recipe-cache";
import { queryDB, verifyToken } from "@/helpers/server-helpers";
import { MongoRecipe, Recipe } from "@/helpers/types";
import { ObjectId } from "mongodb";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, {params}: {params: {id: string}}) {
    const {id} = params;

    console.log('querying db: recipe', id);

    if (!id)
        return new Response(null, {status: 404});


    const result = await queryDB<MongoRecipe, Recipe|false>('recipes', async (col) => {
        const response = await col.findOne({_id: ObjectId.createFromHexString(id)});
        if (response) {
            return fromMongoToRecipe(response);
        }
        return false;
    });

    if (result === null)
        return new Response(null, {status: 500});
    
    if (!result)
        return new Response(null, {status: 404});

    return Response.json(result);
}

type DeleteCommand = 'delete' | 'skip'; 

export async function DELETE(req: NextRequest, {params}: {params: {id: string}}) {

    const userId = verifyToken(cookies(), '/api/recipes/:id delete');
    const {id} = params;

    if (!userId)
        return new Response(null, {status: 401});

    if (!id)
        return new Response(null, {status: 400});

    console.log('querying db: deleting recipe', id);

    const response = await queryDB<MongoRecipe, boolean>('recipes', async (col) => {
        const result = await col.deleteOne({_id: new ObjectId(id), authorId: new ObjectId(userId)});
        return result.acknowledged && result.deletedCount === 1;
    });

    if (response === null)
        return new Response(null, {status: 500});

    if (!response)
        return new Response(null, {status: 404});

    let command : DeleteCommand;

    const initRecipes = await initRecipePreviews();
    if (initRecipes.previews.some(p => p.id === id)) 
        revalidateTag(INIT_RECIPES_TAG);

    revalidateTag(id);
    
    return new Response(null, {status: 200});
}