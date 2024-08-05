'use client'

import { useStoreDispatch } from "@/store/store";
import { listActions } from "@/store/list";
import { generalActions } from "@/store/general";

import { Recipe } from "@/helpers/types";

import SubmitButton from "@/components/ui/elements/SubmitButton";
import { toShoppingListAction } from "@/helpers/server/server-actions/recipe-actions";
import { statusCodeToMessage } from "@/helpers/client/client-helpers";

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
        <SubmitButton color="whiteOutline" shape="square" className="btn btn-outline-light" title="Add to Shopping List">
            <i className="icon-cart"/>
        </SubmitButton>
    </form>
}