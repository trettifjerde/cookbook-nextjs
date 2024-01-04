'use client'

import { useState } from "react";
import { useStoreDispatch } from "@/store/store";
import { listActions } from "@/store/list";
import { Alert, Recipe } from "@/helpers/types";
import { statusCodeToMessage } from "@/helpers/client-helpers";
import { toShoppingListAction } from "@/helpers/server-actions/recipe-actions";
import SubmitButton from "../../ui/elements/SubmitButton";
import PopUp from "../../ui/PopUp";

export default function ShoppingListButton({recipe}: {recipe: Recipe}) {

    console.log('shopping list button');
    const dispatch = useStoreDispatch();
    const [alert, setAlert] = useState<Alert|null>(null);
    
    const handleSubmit = async (f: FormData) => {
        const res = await toShoppingListAction(recipe.ingredients);

        switch(res.status) {
            case 200:
                dispatch(listActions.initialise(res.data));
                setAlert({message: `"${recipe.title}" ingredients added to your shopping list`, isError: false});
                break;

            default:
                setAlert({isError: true, message: statusCodeToMessage(res.status)})
        }
    }

    return <>
        <form action={handleSubmit}>
            <SubmitButton color="whiteOutline" className="btn btn-outline-light">To Shopping List</SubmitButton>
        </form>
        <PopUp alert={alert} setPopUp={setAlert} />
    </>
}