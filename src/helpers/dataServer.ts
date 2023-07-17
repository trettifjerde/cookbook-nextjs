import { castIngredDbToClient, castIngredsDbToClient } from "./casters";
import { CookieUser, FirebaseIngredient, FirebaseRecipe, Method, User } from "./types";
import { makeIngredsUrl, makeRecipeUrl, privateFetch } from "./utils";

export async function updateRecipe(recipe: FirebaseRecipe, id: string, token: string) {
    return privateFetch(
        makeRecipeUrl(id),
        token,
        'PATCH',
        recipe,
        'Failed to send recipe',
        () => ({id})
    );
}

export async function addRecipe(recipe: FirebaseRecipe, token: string) {
    return privateFetch(
        makeRecipeUrl(),
        token,
        'POST',
        recipe,
        'Failed to send recipe',
        (data: {name: string}) => ({id: data.name})
    );
}

export async function deleteRecipe(id: string, token: string) {
    return privateFetch(
        makeRecipeUrl(id),
        token,
        'DELETE',
        null,
        'Failed to delete recipe',
        () => ({})
    );
}

export async function addIngredient(item: any, user: CookieUser) {
    return privateFetch(
        makeIngredsUrl(user.id),
        user.token,
        'POST',
        item,
        'Failed to add item to shopping list',
        res => castIngredDbToClient(res.name, item)
    )
}

export async function updateIngredient(id: any, item: any, user: CookieUser) {
    return privateFetch(
        makeIngredsUrl(user.id, id),
        user.token,
        'PUT',
        item,
        'Failed to update item in the shopping list',
        () => castIngredDbToClient(id, item)
    )
}

export async function updateIngredients(items: FirebaseIngredient[], user: CookieUser) {
    return privateFetch(
        makeIngredsUrl(user.id),
        user.token,
        'PUT',
        items,
        'Failed to send items to shopping list',
        castIngredsDbToClient
    )
}

export async function deleteIngredient(id: string, user: CookieUser) {
    return privateFetch(
        makeIngredsUrl(user.id, id),
        user.token,
        'DELETE',
        null,
        'Failed to delete ingredient',
        (data) => ({})
    );
}