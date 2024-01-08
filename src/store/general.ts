import { Alert } from "@/helpers/types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { listActions } from "./list";
import { recipesActions } from "./recipes";
import { mkAlert } from "@/helpers/casters";

export type GeneralSlice = {
    alert: Alert|null
};
export const initialState : GeneralSlice = {
    alert: null
}

const recipeAdded = (title: string) => `New recipe added: ${title}`;
const recipeUpdated = (title: string) => `Recipe updated: ${title}`;

const generalSlice = createSlice({
    name: 'general',
    initialState,
    reducers: {
        setAlert(state, action: PayloadAction<string|null>) {
            state.alert = action.payload ? mkAlert(action.payload) : null;
        },
        setWarning(state, action: PayloadAction<string>) {
            state.alert = mkAlert(action.payload, 'info');
        },
        setError(state, action: PayloadAction<string>) {
            state.alert = mkAlert(action.payload, 'error');
        },
        addRecipe(state, action: PayloadAction<string>) {
            state.alert = mkAlert(recipeAdded(action.payload));
        },
        editRecipe(state, action: PayloadAction<string>) {
            state.alert = mkAlert(recipeUpdated(action.payload));
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(listActions.initialise, (state, action) => {
                if (action.payload.recipeTitle)
                    state.alert = mkAlert(`"${action.payload.recipeTitle}" ingredients added to your shopping list`);
            })
            .addCase(listActions.add, (state, action) => {
                state.alert = mkAlert(`Item added: ${action.payload.name}`);
            })
            .addCase(listActions.update, (state, action) => {
                state.alert = mkAlert(`Item updated: ${action.payload.name}`);
            })
            .addCase(listActions.merge, (state, action) => {
                state.alert = mkAlert(`Item updated: ${action.payload.ing.name}`);
            })
            .addCase(listActions.removeDupe, (state, action) => {
                state.alert = mkAlert(`Item ${action.payload.dupName} was already on the list, so the duplicate was removed`, 'info');
            })
            .addCase(listActions.delete, (state, action) => {
                state.alert = mkAlert(`Item removed: ${action.payload.name}`);
            })
            .addCase(recipesActions.addRecipe, (state, action) => {
                state.alert = mkAlert(recipeAdded(action.payload.title));
            })
            .addCase(recipesActions.editRecipe, (state, action) => {
                state.alert = mkAlert(recipeUpdated(action.payload.title));
            })
            .addCase(recipesActions.deleteRecipe, (state, action) => {
                state.alert = mkAlert(`Recipe deleted: ${action.payload.title}`);
            })
    }
});

export const generalReducer = generalSlice.reducer;
export const generalActions = generalSlice.actions;