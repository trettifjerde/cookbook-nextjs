'use client'

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useStoreDispatch } from "@/store/store";
import { recipesActions } from "@/store/recipes";
import { listActions } from "@/store/list";

import { Alert, Recipe } from "@/helpers/types";
import { deleteRecipeAction, toShoppingListAction } from "@/helpers/server-actions/recipe-actions";
import { statusCodeToMessage } from "@/helpers/client-helpers";

import Dropdown, { dropdownItemClass } from "../../ui/Dropdown";
import ConfirmationModal from "../../ui/ConfirmationModal";
import PopUp from "../../ui/PopUp";
import { SpinnerButton } from "../../ui/elements/buttons";

export default function AuthorDropdown({recipe}: {recipe: Recipe}) {
    const ddBtnRef = useRef<HTMLDivElement>(null);
    const dispatch = useStoreDispatch();
    const router = useRouter();
    
    const [alert, setAlert] = useState<Alert|null>(null);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pending, setPending] = useState(false);
    
    const toShoppingList = async () => {
        setPending(true);
        const response = await toShoppingListAction(recipe.ingredients);

        switch(response.status) {
            case 200:
                dispatch(listActions.initialise(response.data));
                setAlert({message: `"${recipe.title}" ingredients added to your shopping list`, isError: false})
                break;
            
            default:
                setAlert({message: statusCodeToMessage(response.status), isError: true});
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
                dispatch(recipesActions.deleteRecipe(recipe.id));
                router.replace('/recipes');
                return;

            default:
                setAlert({isError: true, message: statusCodeToMessage(res.status)})
                break;
        }
        setPending(false);
    };

    return <>
        <SpinnerButton ref={ddBtnRef} color="whiteOutline"
            disabled={pending} pending={pending}
            onClick={() => setDropdownVisible(prev => !prev)}
            >Manage</SpinnerButton>

        <Dropdown visible={isDropdownVisible} btn={ddBtnRef} closeDropdown={() => setDropdownVisible(false)}>
            <div className={dropdownItemClass} onClick={toShoppingList}>To Shopping List</div>
            <div className={dropdownItemClass}>
                <Link className="w-full block" href={`/recipes/${recipe.id}/edit`}>Edit Recipe</Link>
            </div>
            <div className={dropdownItemClass} onClick={() => setIsModalVisible(true)}>Delete Recipe</div>
        </Dropdown>

        <ConfirmationModal 
            visible={isModalVisible}
            onConfirm={onDeleteRecipe} 
            closeModal={() => setIsModalVisible(false)}>
                Delete recipe <span className="font-bold">{recipe.title}</span>?
        </ConfirmationModal>

        <PopUp alert={alert} setPopUp={setAlert}></PopUp>
    </>
}