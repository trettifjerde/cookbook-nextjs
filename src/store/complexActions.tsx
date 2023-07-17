import { generalActions } from "./generalState";
import { shoppingListActions } from "./shoppingListState";
import { StoreDispatch, store } from "./store";
import { FirebaseIngredient, User } from "../helpers/types";
import { logOut, removeToken, setToken } from "@/helpers/authClient";
import { castIngredsClientToDb, castRecipeIngredsToClient } from "@/helpers/casters";
import { fetchIngredients, updateShoppingList } from "@/helpers/dataClient";

export function registerLogIn(user: User) {
    return async (dispatch: StoreDispatch) => {
        const listPromise = fetchIngredients(user);
        
        const expiresIn = new Date(user.expirationDate).getTime() - new Date().getTime();
        setToken(user);

        const timer = setTimeout(() => {
            dispatch(tryLogOut(timer));
        }, expiresIn);

        dispatch(generalActions.logIn({...user, timer}));

        const list = await listPromise;
        dispatch(shoppingListActions.initializeItems(list));
    }
}

export function tryLogOut(timer: any) {
    return async(dispatch: StoreDispatch) => {
        const res = await logOut();
        if ('error' in res) {
            dispatch(generalActions.flashToast({text: res.error, isError: true}));
        }
        else {
            clearTimeout(timer);
            removeToken();
            dispatch(generalActions.logOut());
        }
    }
}

export function addRecipeToShoppingList(items: FirebaseIngredient[]) {
    return async (dispatch: StoreDispatch) => {
        dispatch(generalActions.setSubmitting(true));

        const ingreds = castRecipeIngredsToClient(items);
        const shoppingList = store.getState().shoppingList.items;
        const updatedShoppingList = [...shoppingList];

        ingreds.forEach(item => {
            const i = shoppingList.findIndex(it => it.name === item.name && it.unit === item.unit);
            if (i > -1) {
                const existingItem = shoppingList[i];
                updatedShoppingList[i] = {...existingItem, amount: (+existingItem.amount) + (+item.amount)};
            }
            else 
                updatedShoppingList.push({...item});
        });

        const res = await updateShoppingList({ings: castIngredsClientToDb(updatedShoppingList)});
        if ('error' in res) {
            dispatch(generalActions.flashToast({text: res.error, isError: true}));
        }
        else {
            dispatch(shoppingListActions.addIngredientsFromRecipe(res));
            dispatch(generalActions.flashToast({text: 'Recipe ingredients added to shopping list', isError: false}));
        }
    }
}