import { AnyBulkWriteOperation, Collection, ObjectId } from "mongodb";
import { ListUpdaterInstruction, ListUpdaterCommand, MongoIngredient, MongoList, RecipeIngredient, MongoRecipe, MongoRecipePreviewProjection } from "@/helpers/types";
import { LIST_COLLECTION, RECIPE_PREVIEW_BATCH_SIZE, RECIPES_COLLECTION } from "@/helpers/config";
import { dbCol } from "./controller";
import { findDuplicate, fromMongoToIngredient, fromMongoToRecipePreview } from "../casters";

export async function readInitPreviews(lastId? : string | null, isFetchMore=false) {
    
    return dbCol(RECIPES_COLLECTION, (col: Collection<MongoRecipe>) => { 
        const _id = lastId ? ObjectId.createFromHexString(lastId) : null;
        const [filter, skip] = _id ? [{_id: {$gt : _id}}, 0] : [{}, isFetchMore ? RECIPE_PREVIEW_BATCH_SIZE : 0];
        const lastUpdated = new Date().getTime();
        return col
            .find(filter)
            .sort({_id: 1})
            .skip(skip)
            .limit(RECIPE_PREVIEW_BATCH_SIZE)
            .project<MongoRecipePreviewProjection>({title: 1, description: 1, imagePath: 1})
            .toArray()
            .then(list => list.map(rec => fromMongoToRecipePreview(rec, lastUpdated)))
    });
}

type Instruction = ListUpdaterInstruction<MongoIngredient>;

export async function submitIngredient({ingredient, userId, initialId} : {
    ingredient: RecipeIngredient, 
    userId: string, 
    initialId: string
}) {

    const listId = ObjectId.createFromHexString(userId);
    const listItem: MongoIngredient = {
        _id: new ObjectId(initialId ? initialId : undefined), 
        ...ingredient
    };

    return dbCol(LIST_COLLECTION, (col: Collection<MongoList>) => col
        .findOne({_id: listId})
        .then(list => {
            if (!list) {
                return col
                    .insertOne({_id: listId, list: [listItem]})
                    .then(res => {
                        if (!res.acknowledged) 
                            throw new Error(`Inserting list with the first item not acknowledged\n${res}`);

                        return {command: ListUpdaterCommand.Add, ing: listItem} as Instruction;
                    })
            }
            else {
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
                            return col
                                .bulkWrite(operations)
                                .then(res => {
                                    if (!res.isOk()) 
                                        throw new Error(`Bulk error\n${res}`)
                        
                                    if (operations.length === 2) 
                                        return {command: ListUpdaterCommand.Merge, ing: duplicate} as Instruction;
                                    
                                    if (deleteInitial) 
                                        return {command: ListUpdaterCommand.RemoveDupe} as Instruction
                                    
                                    return {command: ListUpdaterCommand.Update, ing: duplicate} as Instruction;
                                })
        
                        default: 
                            return Promise.resolve({command: ListUpdaterCommand.Skip} as Instruction);
                    }
                }
        
                else {
        
                    if (idExists) {
                        return col
                            .updateOne(
                                { _id: listId, "list._id": listItem._id },
                                { $set: { "list.$": listItem } }
                            )
                            .then(res => {
                                if (res.modifiedCount !== 1)
                                    throw new Error(`Tried to update item ${initialId}, but db returned ${res}`);

                                return {command: ListUpdaterCommand.Update, ing: listItem} as Instruction
                            })
                    }
                    
                    else {
                        return col
                            .updateOne({_id: listId}, {$push: {list: listItem}})
                            .then(res => {
                                if (res.modifiedCount !== 1)
                                    throw new Error(`Tried to add item ${initialId}, but db returned ${res}`);
                
                                return {command: ListUpdaterCommand.Add, ing: listItem} as Instruction
                            })
                    }
                }
            }
        })
    );
}

export async function addItemsToUserMongoList(userId: string, recipeIngList: RecipeIngredient[]) {
    const _id = ObjectId.createFromHexString(userId);
    const mongoIngList: MongoIngredient[] = recipeIngList.map(ing => ({ ...ing, _id: new ObjectId() }));

    return dbCol(LIST_COLLECTION, (col: Collection<MongoList>) => col
        .findOne({ _id })
        .then(entry => {
            if (!entry) {
                return col
                    .insertOne({ _id, list: mongoIngList })
                    .then(res => {
                        if (!res.acknowledged)
                            throw new Error('Error creating shopping list while copying recipe ingredients');
                        return mongoIngList;
                    })
            }
    
            const list = entry.list;
            const pushList: MongoIngredient[] = [];
            const operations: AnyBulkWriteOperation<MongoList>[] = [];
    
            // mutate list with new recipe ing list
            for (const item of mongoIngList) {
                const { duplicate, countable } = findDuplicate(list, item);
    
                if (duplicate) {
                    if (countable) {
                        operations.push({
                            updateOne: {
                                filter: { _id, "list._id": duplicate._id },
                                update: { $inc: { "list.$.amount": item.amount! } }
                            }
                        })
                        duplicate.amount! += item.amount!;
                    }
                }
                else {
                    pushList.push(item);
                    list.push(item);
                }
            }
    
            operations.push({
                updateOne: {
                    filter: { _id },
                    update: { $push: { list: { $each: pushList } } }
                }
            });
    
            return col
                .bulkWrite(operations, {})
                .then(res => {
                    if (!res.isOk())
                        throw new Error(`Bulk error!`);
                    return list;
                })
        })
        .then(list => list.map(i => fromMongoToIngredient(i)))
    )

}