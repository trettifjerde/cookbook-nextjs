'use client'

import { useStoreDispatch } from "@/store/store";
import { listActions } from "@/store/list";
import { generalActions } from "@/store/general";

import { Recipe } from "@/helpers/types";
import { statusCodeToMessage } from "@/helpers/client-helpers";
import { toShoppingListAction } from "@/helpers/server-actions/recipe-actions";

import SubmitButton from "@/components/ui/elements/SubmitButton";

export default function ShoppingListButton({recipe}: {recipe: Recipe}) {

    const dispatch = useStoreDispatch();
    
    const handleSubmit = async (f: FormData) => {
        const res = await toShoppingListAction(recipe.ingredients);

        switch(res.status) {
            case 200:
                dispatch(listActions.initialise({ings: res.data, recipeTitle: recipe.title}));
                break;

            default:
                dispatch(generalActions.setError(statusCodeToMessage(res.status)));
        }
    }

    return <form action={handleSubmit}>
        <SubmitButton color="whiteOutline" className="btn btn-outline-light">
            <i className="icon-cart" />
            <span>To Shopping List</span>
        </SubmitButton>
    </form>
}