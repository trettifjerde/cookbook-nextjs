import { Collection, ObjectId } from "mongodb";
import { NextRequest } from "next/server";

import { fromMongoToRecipe } from "@/helpers/server/casters";
import { MongoRecipe } from "@/helpers/types";
import { dbCol } from "@/helpers/server/db/controller";
import { RECIPES_COLLECTION } from "@/helpers/config";

export async function GET(req: NextRequest, {params}: {params: {id: string}}) {
    const {id} = params;

    console.log(`API/recipes/${id}`);

    if (!id)
        return new Response(null, {status: 404});

    const { ok, result } = await dbCol(
        RECIPES_COLLECTION, 
        (col: Collection<MongoRecipe>) => {
            const _id = ObjectId.createFromHexString(id);
            const lastUpdated = new Date().getTime();
            return col
                .findOne({_id})
                .then((recipe) => recipe ? fromMongoToRecipe(recipe, lastUpdated) : null)
        }
    );

    if (!ok)
        return new Response(null, {status: 500});

    if (!result)
        return new Response(null, {status: 404});

    return Response.json(result);
}