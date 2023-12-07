import {createHash} from 'crypto';
import jwt from 'jsonwebtoken';
import { AnyBulkWriteOperation, Collection, Document, MongoClient, ObjectId } from 'mongodb';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { FormRecipe, Ingredient, MongoIngredient, MongoList, MongoRecipe, PreUploadFormRecipe, Recipe, RecipeIngredient, RecipePreview } from './types';
import { RECIPE_PREVIEW_LENGTH } from './config';

export function makeToken(id: string) {
    return jwt.sign({id}, process.env.JWT_PRIVATE!);
}

export function makeHash(password: string) {
    const hash = createHash('sha256')
        .update(password)
        .update(createHash('sha256').update(process.env.SALT!).digest('hex'))
        .digest('hex');

    return hash;
}

export function verifyToken(cookies: ReadonlyRequestCookies, caller: string) {
    const token = cookies.get('token')?.value || '';
    let id: string | null = null;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_PRIVATE!) as {id: string};
            id = decoded.id;
        }
        catch(error) {
            console.log('Token verification error', error);
        }
    }
    console.log('verifying token for', caller, 'Authed:', !!token);
    return id;
}

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

export function fromMongoToRecipe(r: MongoRecipe) {
    const {_id, authorId, ...info} = r;
    const recipe : Recipe = {
        ...info, 
        authorId: authorId.toString(),
        id: _id.toString(), 
        imagePath: r.imagePath || '' 
    };
    return recipe;
}

export function fromMongoToRecipePreview(r: MongoRecipe) {
    const preview : RecipePreview = {
        id: r._id.toString(),
        title: r.title,
        description: r.description.slice(0, RECIPE_PREVIEW_LENGTH),
        imagePath: r.imagePath || ''
    };
    return preview;
}

export function fromMongoToIngredient(ing: MongoIngredient) {
    const {_id, ...info} = ing;
    return {...info, id: _id.toString()} as Ingredient;
}

export function fromRecipeToForm(recipe: Recipe) {
    const {id, ...form} = recipe; 
    return {id, form} as {form: FormRecipe, id: string};
}

export function findDuplicate(list: MongoIngredient[], item: RecipeIngredient, id?: ObjectId) {
    const haveDifferentIds = id ? (item: MongoIngredient) => !item._id.equals(id) : () => true;
    const duplicate = list.find(i => (
        haveDifferentIds(i) &&
        (i.name === item.name) && 
        (i.unit === item.unit) && 
        (typeof i.amount === typeof item.amount)
    ));
    return {duplicate, countable: (!!duplicate && duplicate.amount !== undefined)};
}

export async function addItemsToUserMongoList(userId: string, recipeIngList: RecipeIngredient[]) {
    return await queryDB<MongoList, Ingredient[]>('list', async (col) => {
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