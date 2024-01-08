'use client'

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useStoreDispatch } from "@/store/store";
import { recipesActions } from "@/store/recipes";
import { listActions } from "@/store/list";
import { generalActions } from "@/store/general";

import { Recipe } from "@/helpers/types";
import { deleteRecipeAction, toShoppingListAction } from "@/helpers/server-actions/recipe-actions";
import { statusCodeToMessage } from "@/helpers/client-helpers";

import { SpinnerButton } from "@/components/ui/elements/buttons";
import Dropdown, { dropdownItemClass } from "@/components/ui/Dropdown";
import ConfirmationModal from "@/components/ui/ConfirmationModal";


export default function AuthorDropdown({recipe}: {recipe: Recipe}) {
    const ddBtnRef = useRef<HTMLDivElement>(null);
    const dispatch = useStoreDispatch();
    const router = useRouter();
    
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pending, setPending] = useState(false);
    
    const toShoppingList = async () => {
        setPending(true);
        const response = await toShoppingListAction(recipe.ingredients);

        switch(response.status) {
            case 200:
                dispatch(listActions.initialise({ings: response.data, recipeTitle: recipe.title}));
                break;
            
            default:
                dispatch(generalActions.setError(statusCodeToMessage(response.status)));
                break;
        }
        setPending(false);
    };

    const onDeleteRecipe = async () => {
        setIsModalVisible(false);
        setPending(true);

        const res = await deleteRecipeAction(recipe.id);

        switch (res.status) {
            case 200:
                dispatch(recipesActions.deleteRecipe({id: recipe.id, title: recipe.title}));
                router.replace('/recipes');
                return;

            default:
                dispatch(generalActions.setError(statusCodeToMessage(res.status)));
                break;
        }
        setPending(false);
    };

    return <>
        <SpinnerButton ref={ddBtnRef} color="whiteOutline"
            disabled={pending} pending={pending}
            onClick={() => setDropdownVisible(prev => !prev)}
            >
            <span className="mr-2">Manage</span>
            <i className="icon-cog" />
        </SpinnerButton>

        <Dropdown visible={isDropdownVisible} btn={ddBtnRef} closeDropdown={() => setDropdownVisible(false)}>
            <div className={dropdownItemClass} onClick={toShoppingList}>
                <i className="icon-cart" />
                <span>To Shopping List</span>
            </div>
            <div className={dropdownItemClass}>
                <Link className="w-full block" href={`/recipes/${recipe.id}/edit`}>
                    <i className="icon-pencil" />
                    <span>Edit Recipe</span>
                </Link>
            </div>
            <div className={dropdownItemClass} onClick={() => setIsModalVisible(true)}>
                <i className="icon-bin" />
                <span>Delete Recipe</span>
            </div>
        </Dropdown>

        <ConfirmationModal 
            visible={isModalVisible}
            onConfirm={onDeleteRecipe} 
            closeModal={() => setIsModalVisible(false)}>
                Delete recipe <span className="font-bold">{recipe.title}</span>?
        </ConfirmationModal>
    </>
}