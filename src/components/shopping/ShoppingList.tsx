'use client'
import { useEffect, useState } from "react";

import { useStoreDispatch, useStoreSelector } from "@/store/store";
import { listActions } from "@/store/list";

import ShoppingListSkeleton from "./ShoppingListSkeleton";
import ShoppingListItems from "./ShoppingListItems";
import { fetchList } from "@/helpers/fetchers";

const controller = new AbortController();

export default function ShoppingList () {

    const [fetchError, setFetchError] = useState('');

    const isInitialised = useStoreSelector(state => state.list.isInitialised);
    const dispatch = useStoreDispatch();

    const initialiseList = async () => {
        setFetchError('');
        const res = await fetchList(controller.signal);

        switch(res.type) {
            case 'success':
                setFetchError('');
                dispatch(listActions.initialise(res.data));
                return;

            default: 
                setFetchError(res.message);
        }
    }

    useEffect(() => {
        if (!isInitialised) {
            initialiseList();

            return () => {
                controller.abort();
            }
        }
    }, [isInitialised]);

    return <> 
        {!isInitialised && <>
            { fetchError && <div className="text-center">
                <p>{fetchError}</p>
                <button type="button" className="btn btn-success" onClick={initialiseList}>Retry</button>
            </div>}

            {!fetchError && <ShoppingListSkeleton />}  
        </>} 

        {isInitialised && <ShoppingListItems />}
    </>
};