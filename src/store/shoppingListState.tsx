import { createSlice } from "@reduxjs/toolkit";
import { FormIngredient, Ingredient } from "../helpers/types";

const emptyItem : FormIngredient = {name: '', amount: '', unit: '', id: ''};

const initialState : {
    items: Ingredient[],
    selectedItem: FormIngredient,
    isInitialized: boolean
} = {
    items: [],
    selectedItem: emptyItem,
    isInitialized: false
}

const slice = createSlice({
    name: 'shoppingList',
    initialState,
    reducers: {
        initializeItems(state, action) {
            state.items = sortIngreds(action.payload);
            state.isInitialized = true;
        },
        selectItem(state, action) {
            state.selectedItem = action.payload;
        },
        clearItem(state) {
            state.selectedItem = emptyItem;
        },
        updateItem(state, action) {
            const item = action.payload;
            state.items = sortIngreds([...state.items.filter(i => i.id !== item.id), item]);
            state.selectedItem = emptyItem;
        },
        deleteItem(state, action) {
            state.items = state.items.filter(i => i.id !== action.payload);
        },
        addIngredientsFromRecipe(state, action) {
            state.items = sortIngreds(action.payload);
        },
        clearIngredients() {
            return initialState;
        }
    }
});

export const shoppingListReducer = slice.reducer;
export const shoppingListActions = slice.actions;

function sortIngreds(ingreds: Ingredient[]) {
    let sorted = [...ingreds];
    sorted.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
    return sorted;
}