import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { recipesReducer } from "./recipes";
import { listReducer } from "./list";
import { generalReducer } from "./general";
// import { listenerMiddleware } from "./listener";


export const store = configureStore({
    reducer: {
        recipes: recipesReducer,
        list: listReducer,
        general: generalReducer 
    },
    // middleware: (defMid) => defMid().prepend(listenerMiddleware.middleware)
});

export type StoreState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;

export const useStoreDispatch: () => StoreDispatch = useDispatch;
export const useStoreSelector: TypedUseSelectorHook<StoreState> = useSelector; 

