import { InitPreviewsBatch, RecipePreview } from "@/helpers/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type RecipesSlice = {
    initialised: boolean,
    previews: RecipePreview[], 
    filterStr: string,
    initBatchId: number,
    lastId: string
};
const initialState : RecipesSlice = {
    initialised: false,
    previews: [], 
    filterStr: '',
    initBatchId: 0,
    lastId: ''
};

export const recipeSlice = createSlice({
    name: 'recipes',
    initialState,
    reducers: {
        addRecipe(state, action: PayloadAction<RecipePreview>) {
            state.previews.push(action.payload);
        },
        addMoreRecipes(state, {payload: previews}: PayloadAction<RecipePreview[]>) {
            state.previews = filterFetchedPreviews(previews, state.previews);
            state.lastId = previews[previews.length - 1].id;
        },
        editRecipe (state, {payload: preview}: PayloadAction<RecipePreview>) {
            const index = state.previews.findIndex(r => r.id === preview.id);
            if (index > -1) {
                state.previews[index] = preview;
            }
        },
        deleteRecipe(state, {payload: id}: PayloadAction<string>) {
            const index = state.previews.findIndex(r => r.id === id);
            if (index > -1) {
                state.previews.splice(index, 1);
            }
        },
        syncPreviews(state, {payload: batch}: PayloadAction<InitPreviewsBatch>) {
            if (state.initBatchId !== batch.id) {
                state.previews = filterPreviews(batch, state.previews);
                state.initBatchId = batch.id;
                state.initialised = true;
            }
        },
        setFilter(state, {payload: filterStr}: PayloadAction<string>) {
            state.filterStr = filterStr.toLowerCase();
        }
    }
});

export const recipesReducer = recipeSlice.reducer;
export const recipesActions = recipeSlice.actions;

function filterPreviews(batch: InitPreviewsBatch, clientP: RecipePreview[]) {
    const batchPreviewsIds = batch.previews.map(p => p.id);
    const filteredClient = clientP.filter(p => !batchPreviewsIds.some(id => id === p.id));
    return batch.previews.concat(filteredClient);
}

function filterFetchedPreviews(fetched: RecipePreview[], clientPreviews: RecipePreview[]) {
    const fetchedIds = fetched.map(p => p.id);
    const filteredClient = clientPreviews.filter(p => !fetchedIds.some(id => id === p.id));
    return filteredClient.concat(fetched)
}