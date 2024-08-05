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

const recipeSlice = createSlice({
    name: 'recipes',
    initialState,
    reducers: {
        addMoreRecipes(state, {payload: previews}: PayloadAction<RecipePreview[]>) {
            state.previews = filterFetchedPreviews(previews, state.previews);
            state.lastId = previews[previews.length - 1].id;
        },
        deleteRecipe(state, {payload}: PayloadAction<{id: string, title: string}>) {
            const index = state.previews.findIndex(r => r.id === payload.id);
            if (index > -1) {
                state.previews.splice(index, 1);
            }
        },
        syncInitPreviews(state, {payload: batch}: PayloadAction<InitPreviewsBatch>) {
            if (state.initBatchId !== batch.id) {
                state.previews = filterInitPreviews(batch, state.previews);
                state.initBatchId = batch.id;
                state.initialised = true;
            }
        },
        syncRecipe(state, {payload: preview}: PayloadAction<RecipePreview>) {
            const index = state.previews.findIndex(r => r.id === preview.id);
            if (index > -1) {
                if (state.previews[index].lastUpdated != preview.lastUpdated)
                    state.previews[index] = preview;
            }
            else 
                state.previews.push(preview);
        },
        setFilter(state, {payload: filterStr}: PayloadAction<string>) {
            state.filterStr = filterStr.toLowerCase();
        }
    }
});

function filterInitPreviews(batch: InitPreviewsBatch, clientP: RecipePreview[]) {
    const batchPreviewsIds = batch.previews.map(p => p.id);
    const filteredClient = clientP.filter(p => !batchPreviewsIds.includes(p.id));
    return batch.previews.concat(filteredClient);
}

function filterFetchedPreviews(fetched: RecipePreview[], clientPreviews: RecipePreview[]) {
    const fetchedIds = fetched.map(p => p.id);
    const filteredClient = clientPreviews.filter(p => !fetchedIds.some(id => id === p.id));
    return filteredClient.concat(fetched)
}

export const recipesReducer = recipeSlice.reducer;
export const recipesActions = recipeSlice.actions;