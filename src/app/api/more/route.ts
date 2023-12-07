import { fromMongoToRecipePreview, queryDB } from '@/helpers/server-helpers';
import { MongoRecipe, RecipePreview } from '@/helpers/types'; 
import { RECIPE_PREVIEW_BATCH_SIZE } from '@/helpers/config'; 
import { NextRequest } from 'next/server';
import { ObjectId, Filter, FindOptions } from 'mongodb';

export async function POST(req: NextRequest) {
    console.log('querying for more recipes');
    const {lastId} = await req.json();

    let filter: Filter<MongoRecipe>;
    const options: FindOptions<MongoRecipe> = {
        sort: {_id: 1},
        limit: RECIPE_PREVIEW_BATCH_SIZE,
        projection: {title: 1, description: 1, imagePath: 1},
    };

    if (lastId) {
        filter = {_id: {$gt : new ObjectId(lastId)}};
    }
    else {
        filter = {};
        options.skip = RECIPE_PREVIEW_BATCH_SIZE;
    }


    const recipes = await queryDB<MongoRecipe, RecipePreview[]>('recipes', async (col) => {
        const result = await col.find(filter, options).toArray();
        return result.map(recipe => fromMongoToRecipePreview(recipe))
    });

    if (!recipes)
        return new Response(null, {status: 500});

    return Response.json(recipes);
}