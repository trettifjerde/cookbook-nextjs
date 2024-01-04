import { fromMongoToRecipePreview } from "@/helpers/casters";
import { RECIPE_PREVIEW_BATCH_SIZE } from "@/helpers/config";
import { queryDB } from "@/helpers/db-controller";
import { InitPreviewsBatch, MongoRecipe, RecipePreview } from "@/helpers/types";

export async function GET() {
    console.log('querying db: init recipes');

    const recipes = await queryDB<MongoRecipe, RecipePreview[]>('recipes', async (col) => {
        const result = await col.find({}, {
            sort: {_id: 1},
            limit: RECIPE_PREVIEW_BATCH_SIZE,
            projection: {title: 1, description: 1, imagePath: 1},
        }).toArray();

        return result.map(recipe => fromMongoToRecipePreview(recipe))
    });

    if (!recipes) 
        return new Response(null, {status: 500});
    
    const data : InitPreviewsBatch = {previews: recipes, id: new Date().getTime()};
    return Response.json(data);
}