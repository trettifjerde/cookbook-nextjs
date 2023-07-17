import { RecipePreview } from "@/helpers/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
    recipes: RecipePreview[],
    isInitialized: boolean
} = {
    recipes: [],
    isInitialized: false
};

const recipes = createSlice({
    name: 'recipes',
    initialState,
    reducers: {
        initRecipes(state, action) {
            state.recipes = [...action.payload];
            state.isInitialized = true;
        },
        loadMoreRecipes(state, action) {
            state.recipes = [...state.recipes, ...action.payload]
        },
        addRecipe(state, action) {
            state.recipes = [...state.recipes, action.payload]
        },
        updateRecipe(state, action) {
            const updRec = [...state.recipes];
            const updI = updRec.findIndex(r => r.id === action.payload.id);
            updRec[updI] = action.payload;
            state.recipes = updRec;
        },
        deleteRecipe(state, action) {
            state.recipes = state.recipes.filter(r => r.id !== action.payload)
        }
        
    }
});

export const recipesReducer = recipes.reducer;
export const recipesActions = recipes.actions;