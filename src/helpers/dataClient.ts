import { castIngredsDbToClient, transformFirebaseRecipe, transformRecipeList } from "./casters";
import { CookieUser } from "./types";
import { fetchData, makeError, makeIngredsUrl, makeRecipeUrl, privateFetch } from "./utils";

export const MAX_FETCH_BATCH = 3;

async function publicFetch(url: string, errorMessage: string, callback: (d: any) => any) {
    return fetch(url, {next: {revalidate: 10}})
    .then(response => {
        if (!response.ok) throw new Error(errorMessage, {cause: response.status})
        else return response.json()
    })
    .then(data => callback(data))
    .catch(makeError);
}

export async function fetchRecipes(startAt='') {
    const url = makeRecipeUrl() + '?' + encodeURI(
        [["orderBy", '"$key"'].join('='),
        ["startAt", `${startAt ? `"${startAt}0"` : ''}`].join('='),
        ["limitToFirst", `${MAX_FETCH_BATCH}`].join('=')].join('&')
    )
    return publicFetch(url, 'Failed to fetch recipes', transformRecipeList)
}

export async function fetchRecipe(recipeId: string) {
    return publicFetch(
        makeRecipeUrl(recipeId), 
        'Failed to fetch recipe', 
        (data) => {
            if (data) return transformFirebaseRecipe(data, recipeId)
            else throw new Error('Recipe does not exist', {cause: 404});
        }
    );
}

export async function fetchIngredients(user: CookieUser) {
    return privateFetch(
        makeIngredsUrl(user.id), 
        user.token,
        'GET',
        null,
        'Failed to fetch ingredients', 
        castIngredsDbToClient
    );
}

export async function updateShoppingList(data: any) {
    return fetchData('/api/list', 'POST', data);
}

export async function getRecipe(id: string) {
    const recipe = await fetchRecipe(id);
    if ('error' in recipe) {
        throw new Error('Recipe not found');
    }
    return recipe;
}