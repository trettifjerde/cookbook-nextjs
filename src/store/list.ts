import { FormIngredient, Ingredient } from "@/helpers/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ListState = {
    selectedItem: FormIngredient,
    list: Ingredient[],
    isInitialised: boolean
};

const initialState : ListState = {
    list: [],
    isInitialised: false,
    selectedItem: prepareFormIngredient(null)
};

const listSlice = createSlice({
    name: 'shopping-list',
    initialState,
    reducers: {
        initialise(state, action: PayloadAction<{ings: Ingredient[], recipeTitle?: string}>) {
            state.isInitialised = true;
            state.list = sortIngredients(action.payload.ings);
        },
        selectItem: {
            prepare: (ing: Ingredient | null) => {
                const f = prepareFormIngredient(ing);
                return {payload: f};
            },
            reducer: (state, action: PayloadAction<FormIngredient>) => {
                state.selectedItem = action.payload;
            }
        },
        add(state, action: PayloadAction<Ingredient>) {
            state.list = sortIngredients([...state.list, action.payload, ]);
            state.selectedItem = prepareFormIngredient(null);
        },
        update(state, action: PayloadAction<Ingredient>) {
            state.list = sortIngredients([...state.list.filter(i => i.id !== action.payload.id), action.payload]);
            state.selectedItem = prepareFormIngredient(null);
        },
        merge(state, action: PayloadAction<{ing: Ingredient, id: string}>) {
            const {ing, id} = action.payload;
            state.list = sortIngredients([...state.list.filter(i => (i.id !== id && i.id !== ing.id)), ing]);
            state.selectedItem = prepareFormIngredient(null);
        },
        removeDupe(state, {payload}: PayloadAction<{id: string, dupName: string}>) {
            state.list = deleteItemFromList(state.list, payload.id);
            state.selectedItem = prepareFormIngredient(null);
        },
        delete(state, {payload}: PayloadAction<{id: string, name: string}>) {
            state.list = deleteItemFromList(state.list, payload.id);
            if (state.selectedItem)
                state.selectedItem = prepareFormIngredient(null);
        }
    }
});

export const listReducer = listSlice.reducer;
export const listActions = listSlice.actions;

function prepareFormIngredient(ing: Ingredient | null) {
    const f : FormIngredient = ing ? {
        id: ing.id,
        name: ing.name,
        amount: ing.amount?.toString() || '',
        unit: ing.unit || ''
    } : {
        id: '',
        name: '',
        amount: '',
        unit: ''
    };
    return f;
}

function sortIngredients(ings: Ingredient[]) {
    return ings.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
}

function deleteItemFromList(list: Ingredient[], id: string) {
    const index = list.findIndex(i => i.id === id);
    if (index > -1)
        return list.toSpliced(index, 1);
    else
        return list;
}