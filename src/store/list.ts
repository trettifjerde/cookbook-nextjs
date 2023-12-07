import { Alert, FormIngredient, Ingredient } from "@/helpers/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ListState = {
    selectedItem: FormIngredient,
    list: Ingredient[],
    isInitialised: boolean,
    alert: Alert|null
};

const initialState : ListState = {
    list: [],
    isInitialised: false,
    selectedItem: prepareFormIngredient(null),
    alert: null
};

const listSlice = createSlice({
    name: 'shopping-list',
    initialState,
    reducers: {
        initialise(state, action: PayloadAction<Ingredient[]>) {
            state.isInitialised = true;
            state.list = sortIngredients(action.payload);
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
            state.alert = {message: `Item added: ${action.payload.name}`, isError: false};
        },
        update(state, action: PayloadAction<Ingredient>) {
            state.list = sortIngredients([...state.list.filter(i => i.id !== action.payload.id), action.payload]);
            state.selectedItem = prepareFormIngredient(null);
            state.alert = {message: `Item updated: ${action.payload.name}`, isError: false};
        },
        merge(state, action: PayloadAction<{ing: Ingredient, id: string}>) {
            const {ing, id} = action.payload;
            state.list = sortIngredients([...state.list.filter(i => (i.id !== id && i.id !== ing.id)), ing]);
            state.selectedItem = prepareFormIngredient(null);
            state.alert = {message: `Item updated: ${ing.name}`, isError: false};
        },
        delete(state, {payload}: PayloadAction<{id: string, dupName?: string}>) {
            const {id, dupName} = payload;

            const index = state.list.findIndex(i => i.id === id);
            
            if (index > -1) {
                const deletedItem = state.list.splice(index, 1)[0];
                if (dupName)
                    state.alert = {message: `Item ${dupName} was already on the list, so the duplicate was removed`, isError: false};
                else
                    state.alert = {message: `Item removed: ${deletedItem.name}`, isError: false};
            }

            if (state.selectedItem)
                state.selectedItem = prepareFormIngredient(null);
        },
        setAlert(state, action: PayloadAction<Alert|null>) {
            state.alert = action.payload;
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