'use client'
import { useEffect, useState } from "react";

import { useStoreDispatch, useStoreSelector } from "@/store/store";
import { listActions } from "@/store/list";

import { fetchList } from "@/helpers/fetchers";

import ShoppingListSkeleton from "./list/ShoppingListSkeleton";
import ShoppingListItems from "./list/ShoppingListItems";
import { Button } from "../ui/elements/buttons";

const controller = new AbortController();

export default function ShoppingList () {

    const [fetchError, setFetchError] = useState('');

    const isInitialised = useStoreSelector(state => state.list.isInitialised);
    const dispatch = useStoreDispatch();

    const initialiseList = async () => {
        setFetchError('');
        const res = await fetchList(controller.signal);

        if (!res.ok)
            setFetchError(res.message);

        else {
            setFetchError('');
            dispatch(listActions.initialise({ings: res.data}));
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