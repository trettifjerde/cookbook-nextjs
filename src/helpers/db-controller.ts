import { AnyBulkWriteOperation, Collection, Document, MongoClient, ObjectId } from 'mongodb';
import { Ingredient, MongoIngredient, MongoList, RecipeIngredient } from './types';
import { findDuplicate, fromMongoToIngredient } from './casters';

export async function queryDB<D extends Document, T>(colName: 'users' | 'list' | 'recipes', callback: (col: Collection<D>) => Promise<T>) {
    try {
        const client = await MongoClient.connect(process.env.DB_URL!);

        try {
            const collectionName = colName === 'users' ? process.env.USERS_COLLECTION! :
                colName === 'list' ? process.env.LIST_COLLECTION! :
                process.env.RECIPES_COLLECTION!;

            const collection = client.db(process.env.COOKBOOK_DB!).collection<D>(collectionName);
            const res = await callback(collection);
            client.close();
            return res;
        }
        catch(error: any) {
            console.log('query db error', error);
            client.close();
            return null;
        }
    }
    catch(error) {
        console.log('query db error', error);
        return null;
    }
}

export async function addItemsToUserMongoList(userId: string, recipeIngList: RecipeIngredient[]) {
    return queryDB<MongoList, Ingredient[]>('list', async (col) => {
        const _id = new ObjectId(userId);
        const entry = await col.findOne({_id});
        const mongoIngList : MongoIngredient[] = recipeIngList.map(ing => ({...ing, _id: new ObjectId()}));

        if (!entry) {
            const res = await col.insertOne({_id, list: mongoIngList});

            if (!res.acknowledged)
                throw new Error('Error creating shopping list while copying recipe ingredients');

            return mongoIngList.map(i => fromMongoToIngredient(i));
        }

        const list = entry.list;
        const pushList : MongoIngredient[] = [];
        const operations : AnyBulkWriteOperation<MongoList>[] = [];

        // mutate list with new recipe ing list
        for (const item of mongoIngList) {
            const {duplicate, countable} = findDuplicate(list, item);
            
            if (duplicate) {
                if (countable) {
                    operations.push({updateOne: {
                        filter: { _id, "list._id": duplicate._id },
                        update: { $inc: {"list.$.amount": item.amount! }}
                    }})
                    duplicate.amount! += item.amount!; 
                }
            }
            else {
                pushList.push(item);
                list.push(item);
            }
        }

        operations.push({updateOne: {
            filter: { _id }, 
            update: { $push: { list: { $each: pushList } } }
        }});

        const response = await col.bulkWrite(operations, {});

        if (!response.isOk())
            throw new Error(`Bulk error!`);

        return list.map(i => fromMongoToIngredient(i));
    });
}