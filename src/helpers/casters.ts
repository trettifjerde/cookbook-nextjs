import { ObjectId } from "mongodb";
import { RECIPE_PREVIEW_LENGTH } from "./config";
import { Alert, FormRecipe, Ingredient, MongoIngredient, MongoRecipe, Recipe, RecipeIngredient, RecipePreview } from "./types";

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

export function mkAlert(message: string, isError?: boolean) : Alert {
    return {
        message,
        isError: !!isError,
        id: new Date().getTime()
    };
}