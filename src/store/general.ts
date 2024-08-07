import { Alert, AlertType, RecipePreview } from "@/helpers/types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { listActions } from "./list";
import { recipesActions } from "./recipes";

export type GeneralSlice = {
    alert: Alert
};

const recipeAdded = (title: string) => `New recipe added: ${title}`;
const recipeUpdated = (title: string) => `Recipe updated: ${title}`;
const mkAlert = (message: string|null, type?: AlertType) => (
    message ? {
        message,
        type: type || 'success'
    } : null
);
const getInitState = () => ({alert: mkAlert(null)});

const generalSlice = createSlice({
    name: 'general',
    initialState: getInitState(),
    reducers: {
        setAlert(state, action: PayloadAction<string|null>) {
            state.alert = mkAlert(action.payload);
        },
        setWarning(state, action: PayloadAction<string>) {
            state.alert = mkAlert(action.payload, 'info');
        },
        setError(state, action: PayloadAction<string>) {
            state.alert = mkAlert(action.payload, 'error');
        },
        addRecipe(state, action: PayloadAction<RecipePreview>) {
            state.alert = mkAlert(recipeAdded(action.payload.title));
        },
        editRecipe(state, action: PayloadAction<RecipePreview>) {
            state.alert = mkAlert(recipeUpdated(action.payload.title));
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
            .addCase(recipesActions.deleteRecipe, (state, action) => {
                state.alert = mkAlert(`Recipe deleted: ${action.payload.title}`);
            })
    }
});

export const generalReducer = generalSlice.reducer;
export const generalActions = generalSlice.actions;