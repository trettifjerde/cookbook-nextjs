import { Collection, ObjectId } from "mongodb";
import { NextRequest } from "next/server";

import { fromMongoToIngredient } from "@/helpers/server/casters";
import getUserId from "@/helpers/server/cachers/token";
import { MongoList } from "@/helpers/types";
import { dbCol } from "@/helpers/server/db/controller";
import { LIST_COLLECTION } from "@/helpers/config";

export async function GET() {
    const userId = getUserId();

    if (!userId)
        return new Response(null, { status: 401 });

    try {
        const _id = ObjectId.createFromHexString(userId)
        const {ok, result} = await dbCol(
            LIST_COLLECTION, 
            (col : Collection<MongoList>) => col.findOne({ _id })
        );
    
        if (!ok) 
            return new Response(null, { status: 500 });

        if (!result)
            return Response.json([]);

        try {
            const list = result.list.map(ing => fromMongoToIngredient(ing));
            return Response.json(list);
        }
        catch (error) {
            console.log('Error sending transformed ingredient list');
            return new Response(null, { status: 500 })
        }
    }
    catch(error) {
        console.log(error);
        return new Response(null, {status: 401});
    }
}