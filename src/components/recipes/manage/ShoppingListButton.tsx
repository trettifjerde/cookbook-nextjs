'use client'

import { useStoreDispatch } from "@/store/store";
import { listActions } from "@/store/list";
import { generalActions } from "@/store/general";
import { Recipe } from "@/helpers/types";
import { statusCodeToMessage } from "@/helpers/client-helpers";
import { toShoppingListAction } from "@/helpers/server-actions/recipe-actions";
import SubmitButton from "../../ui/elements/SubmitButton";

export default function ShoppingListButton({recipe}: {recipe: Recipe}) {

    console.log('shopping list button');
    const dispatch = useStoreDispatch();
    
    const handleSubmit = async (f: FormData) => {
        const res = await toShoppingListAction(recipe.ingredients);

        switch(res.status) {
            case 200:
                dispatch(listActions.initialise({ings: res.data, recipeTitle: recipe.title}));
                break;

            default:
                dispatch(generalActions.setAlert({isError: true, message: statusCodeToMessage(res.status)}));
        }
    }

    return <form action={handleSubmit}>
        <SubmitButton color="whiteOutline" className="btn btn-outline-light">To Shopping List</SubmitButton>
    </form>
}