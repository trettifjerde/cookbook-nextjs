'use server'

import { AnyBulkWriteOperation, ObjectId } from "mongodb";
import { Ingredient, MongoIngredient, MongoList, RecipeIngredient, ServerActionResponse, ServerActionResponseWithData } from "../types";
import { findDuplicate, fromMongoToIngredient } from "../casters";
import getUserId from "../cachers/token";
import { queryDB } from "../db-controller";

type Instruction<T> = {command: 'add', ing: T} |
    {command: 'update', ing: T} | 
    {command: 'merge', ing: T} |
    {command: 'delete'} |
    {command: 'skip'};

export async function sendIngredient(ing: RecipeIngredient, initialId: string) : 
    Promise<ServerActionResponseWithData<Instruction<Ingredient>>> {
    const userId = getUserId();

    if (!userId)
        return {status: 401};

    const listId = new ObjectId(userId);
    const listItem : MongoIngredient = {_id: new ObjectId(initialId || undefined), ...ing};

    const response = await queryDB<MongoList, Instruction<MongoIngredient>>('list', async (col) => {
        const list = await col.findOne({_id: listId});

        if (!list) {
            const res = await col.insertOne({_id: listId, list: [listItem]});
            if (!res.acknowledged) 
                throw new Error(`Inserting list with the first item not acknowledged\n${res}`);

            return {command: 'add', ing: listItem};
        }

        const idExists = !!initialId && list.list.some(i => i._id.equals(listItem._id));

        if (initialId && !idExists)
            throw new Error(`Received command to update item ${initialId}, but item not in the list`);

        const {duplicate, countable} = findDuplicate(list.list, listItem, idExists ? listItem._id : undefined);

        if (duplicate) {
            const operations : AnyBulkWriteOperation<MongoList>[] = [];
            let deleteInitial = false;

            if (countable) {
                operations.push({updateOne: {
                    filter: {_id: listId, "list._id": duplicate._id},
                    update: {$inc: {"list.$.amount": listItem.amount}}
                }});
                duplicate.amount! += listItem.amount!;
            }
            // if we're in update, delete initial item
            if (idExists) {
                operations.push({updateOne: {
                    filter: { _id: listId },
                    update: { $pull: { list: { _id: listItem._id }}}
                }});
                deleteInitial = true;
            }

            switch (operations.length) {
                case 1: 
                case 2: 
                    const res = await col.bulkWrite(operations);

                    if (!res.isOk()) 
                        throw new Error(`Bulk error\n${res}`)
        
                    if (operations.length === 2) 
                        return {command: 'merge', ing: duplicate};
                    
                    if (deleteInitial) 
                        return {command: 'delete'}
                    
                    return {command: 'update', ing: duplicate}

                default: 
                    return {command: 'skip'};
            }
        }

        else {

            if (idExists) {
                const res = await col.updateOne(
                    { _id: listId, "list._id": listItem._id },
                    { $set: { "list.$": listItem } }
                );
                if (res.modifiedCount !== 1)
                    throw new Error(`Tried to update item ${initialId}, but db returned ${res}`);

                return {command: 'update', ing: listItem}
            }
            
            else {
                const res = await col.updateOne({_id: listId}, {$push: {list: listItem}});

                if (res.modifiedCount !== 1)
                    throw new Error(`Tried to add item ${initialId}, but db returned ${res}`);

                return {command: 'add', ing: listItem}
            }
        }
    });

    if (response === null) 
        return {status: 500}

    return {status: 200, data: transformInstruction(response)};
}

export async function deleteIngredient(id: string) : Promise<ServerActionResponse> {
    const userId = getUserId();
    
    if (!userId)
        return {status: 401};

    const result = await queryDB<MongoList, boolean>('list', async (col) => {
        const ingId = new ObjectId(id);
        const response = await col.updateOne(
            {_id: new ObjectId(userId)},
            {$pull : {list: {_id: ingId } } }
        );
        return response.modifiedCount === 1;
    })

    if (result === null)
        return {status: 500};

    if (!result) 
        return {status: 400};

    return {status: 200}
}

function transformInstruction(res: Instruction<MongoIngredient>) {

    let data : Instruction<Ingredient>;
    
    switch(res.command) {
        case 'add':
        case 'merge':
        case 'update':
            data = {command: res.command, ing: fromMongoToIngredient(res.ing)};
            break;

        default: 
            data = {command: res.command};
    }
    return data;
}