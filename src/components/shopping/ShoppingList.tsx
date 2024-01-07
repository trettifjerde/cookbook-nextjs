'use client'
import { useEffect, useState } from "react";

import { useStoreDispatch, useStoreSelector } from "@/store/store";
import { listActions } from "@/store/list";

import ShoppingListSkeleton from "./ShoppingListSkeleton";
import ShoppingListItems from "./ShoppingListItems";
import { fetchList } from "@/helpers/fetchers";
import { Button } from "../ui/elements/buttons";

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
                dispatch(listActions.initialise({ings: res.data}));
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
            { fetchError && <div className="text-center my-8">
                <p className="mb-4">{fetchError}</p>
                <Button type="button" color="green" onClick={initialiseList}>Retry</Button>
            </div>}

            {!fetchError && <ShoppingListSkeleton />}  
        </>} 

        {isInitialised && <ShoppingListItems />}
    </>
};