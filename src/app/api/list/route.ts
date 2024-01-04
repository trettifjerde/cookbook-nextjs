import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

import { fromMongoToIngredient } from "@/helpers/casters";
import { queryDB } from "@/helpers/db-controller";
import getUserId from "@/helpers/cachers/token";
import { Ingredient, MongoList } from "@/helpers/types";

export async function GET(req: NextRequest) {
    const userId = getUserId();
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