'use server'

import { Collection, ObjectId } from "mongodb";
import { Ingredient, ListUpdaterInstruction, ListUpdaterCommand, MongoIngredient, MongoList, RecipeIngredient, ServerActionResponse, ServerActionResponseWithData} from '../../types';
import { fromMongoToIngredient } from "../casters";
import getUserId from "../cachers/token";
import { submitIngredient } from "../db/queries";
import { dbCol } from "../db/controller";
import { LIST_COLLECTION } from "@/helpers/config";

export async function sendIngredient(ingredient: RecipeIngredient, initialId: string) : 
    Promise<ServerActionResponseWithData<ListUpdaterInstruction<Ingredient>>> {

    console.log('querying db: sending ingredient');

    const userId = getUserId();

    if (!userId)
        return {status: 401};

    const { ok, result } = await submitIngredient({userId, ingredient, initialId});

    if (!ok || !result) 
        return {status: 500}

    return {status: 200, data: transformInstruction(result)};
}

export async function deleteIngredient(id: string) : Promise<ServerActionResponse> {
    console.log('deleting ingredient');

    const userId = getUserId();
    
    if (!userId)
        return {status: 401};

    const ingId = new ObjectId(id);

    const {ok, result} = await dbCol(LIST_COLLECTION, (col: Collection<MongoList>) => col
        .updateOne(
            {_id: new ObjectId(userId)},
            {$pull : {list: {_id: ingId } } }
        )
        .then(res => res.modifiedCount === 1)
    );

    if (!ok)
        return {status: 500};

    if (!result) 
        return {status: 400};

    return {status: 200}
}

function transformInstruction(res: ListUpdaterInstruction<MongoIngredient>) {

    let data : ListUpdaterInstruction<Ingredient>;
    
    switch(res.command) {
        case ListUpdaterCommand.Add:
        case ListUpdaterCommand.Merge:
        case ListUpdaterCommand.Update:
            data = {command: res.command, ing: fromMongoToIngredient(res.ing)};
            break;

        default: 
            data = {command: res.command};
    }
    return data;
}