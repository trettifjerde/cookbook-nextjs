import { Alert } from "@/helpers/types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { listActions } from "./list";
import { recipesActions } from "./recipes";

export type GeneralSlice = {
    alert: Alert|null
};
export const initialState : GeneralSlice = {
    alert: null
}

const generalSlice = createSlice({
    name: 'general',
    initialState,
    reducers: {
        setAlert(state, action: PayloadAction<Alert|null>) {
            state.alert = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(listActions.initialise, (state, action) => {
                if (action.payload.recipeTitle)
                    state.alert = {message: `"${action.payload.recipeTitle}" ingredients added to your shopping list`, isError: false};
            })
            .addCase(listActions.add, (state, action) => {
                state.alert = {message: `Item added: ${action.payload.name}`, isError: false};
            })
            .addCase(listActions.update, (state, action) => {
                state.alert = {message: `Item updated: ${action.payload.name}`, isError: false};
            })
            .addCase(listActions.merge, (state, action) => {
                state.alert = {message: `Item updated: ${action.payload.ing.name}`, isError: false};
            })
            .addCase(listActions.removeDupe, (state, action) => {
                state.alert = {message: `Item ${action.payload.dupName} was already on the list, so the duplicate was removed`, isError: false};
            })
            .addCase(listActions.delete, (state, action) => {
                state.alert = {message: `Item removed: ${action.payload.name}`, isError: false};
            })
            .addCase(recipesActions.addRecipe, (state, action) => {
                state.alert = {message: `New recipe added: ${action.payload.title}`, isError: false};
            })
            .addCase(recipesActions.editRecipe, (state, action) => {
                state.alert = {message: `Recipe updated: ${action.payload.title}`, isError: false};
            })
            .addCase(recipesActions.deleteRecipe, (state, action) => {
                state.alert = {message: `Recipe deleted: ${action.payload.title}`, isError: false};
            })
    }
});

export const generalReducer = generalSlice.reducer;
export const generalActions = generalSlice.actions;