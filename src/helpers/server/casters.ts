import { ObjectId, WithId } from "mongodb";
import { RECIPE_PREVIEW_LENGTH } from "../config";
import { FormRecipe, Ingredient, MongoIngredient, MongoRecipe, MongoRecipePreviewProjection, Recipe, RecipeIngredient, RecipePreview } from "../types";

export function fromMongoToRecipe(r: WithId<MongoRecipe>, lastUpdated: number) {
    const {_id, authorId, ...info} = r;
    const recipe : Recipe = {
        ...info, 
        authorId: authorId.toString(),
        id: _id.toString(), 
        imagePath: r.imagePath || '',
        lastUpdated
    };
    return recipe;
}

export function fromMongoToRecipePreview(r: WithId<MongoRecipe> | MongoRecipePreviewProjection, lastUpdated: number) {
    const preview : RecipePreview = {
        title: r.title,
        id: r._id.toString(),
        description: r.description.slice(0, RECIPE_PREVIEW_LENGTH),
        imagePath: r.imagePath || '',
        lastUpdated
    };
    return preview;
}

export function fromMongoToIngredient(ing: MongoIngredient) {
    const {_id, ...info} = ing;
    return {...info, id: _id.toString()} as Ingredient;
}

export function fromRecipeToForm(recipe: Recipe) {
    const {id, lastUpdated, authorId, ...form} = recipe; 
    return {id, form} as {form: FormRecipe, id: string};
}

export function fromRecipeToPreview(recipe: Recipe) {
    const {title, description, imagePath, id, lastUpdated} = recipe;
    const preview: RecipePreview = {
        title,
        description,
        imagePath,
        id,
        lastUpdated
    }
    return preview;
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