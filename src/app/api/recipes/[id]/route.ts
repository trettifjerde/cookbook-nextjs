import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

import { fromMongoToRecipe } from "@/helpers/casters";
import { MongoRecipe, Recipe } from "@/helpers/types";
import { queryDB } from "@/helpers/db-controller";


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