'use client'

import { Alert, RecipeIngredient } from "@/helpers/types";
import SubmitButton from "../ui/elements/SubmitButton";
import { toShoppingListAction } from "@/helpers/recipe-actions";
import { useStoreDispatch } from "@/store/store";
import { listActions } from "@/store/list";
import { statusCodeToMessage } from "@/helpers/client-helpers";
import PopUp from "../ui/PopUp";
import { useState } from "react";

export default function ShoppingListButton({ingredients}: {ingredients: RecipeIngredient[]}) {

    console.log('shopping list button');
    const dispatch = useStoreDispatch();
    const [alert, setAlert] = useState<Alert|null>(null);
    
    const handleSubmit = async (f: FormData) => {
        const res = await toShoppingListAction(ingredients);

        switch(res.status) {
            case 200:
                dispatch(listActions.initialise(res.data));
                setAlert({isError: false, message: 'Ingredients added to your shopping list'});
                break;

            default:
                setAlert({isError: true, message: statusCodeToMessage(res.status)})
        }
    }

    return <div>
        <form action={handleSubmit}>
            <SubmitButton className="btn btn-outline-light">To Shopping List</SubmitButton>
        </form>
        <PopUp alert={alert} setPopUp={setAlert} />
    </div>
}