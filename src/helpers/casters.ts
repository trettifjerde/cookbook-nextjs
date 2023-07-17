import { AuthForm, FirebaseIngredient, FirebaseRecipe, FormRecipe, Ingredient, Recipe, RecipePreview } from "./types";

export function castFormToAuthRequest(form: AuthForm) {
    const {email, password} = form;
    return {email, password, returnSecureToken: true};
}

export function transformRecipeList(data: {[id: string]: FirebaseRecipe}) {
    return data ? Object.entries(data).reduce(
        (acc, [id, recipe]) => {
            acc.push({
                name: recipe.name,
                id: id,
                description: recipe.description,
                imagePath: recipe.imagePath
            } as RecipePreview)
            return acc;
        }, [] as RecipePreview[]) : []
}

export function transformFirebaseRecipe(recipe: FirebaseRecipe, id: string) {
    return recipe ? makeRecipe(recipe, id) : null;
}

export function makeRecipe(recipeData: FirebaseRecipe, id: string) {
    return {
        name: recipeData.name,
        id: id,
        description: recipeData.description,
        imagePath: recipeData.imagePath,
        steps: [...recipeData.steps],
        ingredients: [...recipeData.ingredients]
    } as Recipe
}

export function makeFormRecipe() {
    return {
        name: '',
        id: null,
        description: '',
        imagePath: '',
        steps: [],
        ingredients: []
    } as FormRecipe
}

export function castIngredsDbToClient(data: {[id: string]: FirebaseIngredient}) {
    return data ? Object.entries(data).filter(([id, ing]) => ing).map(([id, ing]) => (castIngredDbToClient(id, ing))) : [];
}

export function castIngredDbToClient(id: string, data: FirebaseIngredient) {
    return {
        id: id,
        name: data.name,
        amount: data.amount ? +data.amount : 0,
        unit: data.unit || ''
    } as Ingredient
}

export function castIngredFormDataToClient(formData: FormData) {
    const name = formData.get('name')?.toString().trim();
    const amount = formData.get('amount')?.toString().trim();
    const unit = formData.get('unit')?.toString().trim();
    const id = formData.get('id')?.toString().trim();
    return {
        id,
        name,
        amount: amount ? +amount : 0,
        unit: unit || null,
    } as Ingredient;
}

export function castIngredClientToDb(ingred: Ingredient) {
    const ing: FirebaseIngredient = {name: ingred.name};
    if (ingred.amount)
        ing.amount = ingred.amount;
    if (ingred.unit)
        ing.unit = ingred.unit;
    return ing;
}

export function castRecipeIngredToClient(item: FirebaseIngredient) {
    return {
        id: '',
        name: item.name,
        amount: item.amount || 0,
        unit: item.unit || '',
    } as Ingredient;
}

export function castRecipeIngredsToClient(items: FirebaseIngredient[]) {
    return items.map(item => castRecipeIngredToClient(item))
}

export function castIngredsClientToDb(ingreds: Ingredient[]) {
    return ingreds.map(ingred => castIngredClientToDb(ingred))
}