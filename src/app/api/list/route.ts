import { addItemsToUserMongoList, findDuplicate, fromMongoToIngredient, queryDB, verifyToken } from "@/helpers/server-helpers";
import { Ingredient, MongoIngredient, MongoList, RecipeIngredient } from "@/helpers/types";
import { AnyBulkWriteOperation, ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const userId = verifyToken(cookies(), '/api/list get');
    console.log('querying db shopping list for', userId);
    
    if (!userId)
        return new Response(null, {status: 401});

    const result = await queryDB<MongoList, Ingredient[]>('list', async (col) => {
        const response = await col.findOne({_id: new ObjectId(userId)});
        if (!response)
            return [] as Ingredient[]

        return response.list.map(ing => fromMongoToIngredient(ing))
    });

    if (!result)
        return new Response(null, {status: 500});

    return Response.json(result);
}

export async function POST(req: NextRequest) {
    const userId = verifyToken(cookies(), '/api/list post');
    if (!userId) 
        return new Response(null, {status: 401});

    const recipeIngList = await readList(req);
    if (!recipeIngList)
        return new Response(null, {status: 400});

    const result = await addItemsToUserMongoList(userId, recipeIngList);
    if (!result)
        return new Response(null, {status: 500});

    return Response.json(result, {status: 200});
}

async function readList(req: NextRequest) {
    let list : RecipeIngredient[] | null = null

    try {
        list = await req.json();
    }
    catch(error) {
        console.log('Error reading recipe list', error);
    }

    return list;
}