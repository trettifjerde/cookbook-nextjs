import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook} from 'react-redux';
import { generalReducer } from './generalState';
import { shoppingListReducer } from './shoppingListState';
import { recipesReducer } from './recipesState';

export const store = configureStore({
    reducer: {
        shoppingList: shoppingListReducer,
        recipes: recipesReducer,
        general: generalReducer
    }
});

export type StoreState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;
export const useStoreDispatch: () => StoreDispatch = useDispatch;
export const useStoreSelector: TypedUseSelectorHook<StoreState> = useSelector;