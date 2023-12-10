'use client'

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStoreDispatch } from "@/store/store";
import { recipesActions } from "@/store/recipes";
import { Alert, Recipe } from "@/helpers/types";
import { addRecipeToShoppingList, deleteRecipe } from "@/helpers/fetchers";
import Dropdown, { dropdownItemClass } from "../ui/Dropdown";
import ConfirmationModal from "../ui/ConfirmationModal";
import { listActions } from "@/store/list";
import PopUp from "../ui/PopUp";
import { SpinnerButton } from "../ui/elements/buttons";

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
        const response = await addRecipeToShoppingList(recipe.ingredients);

        switch(response.type) {
            case 'success':
                dispatch(listActions.initialise(response.data));
                setAlert({message: `"${recipe.title}" ingredients added to your shopping list`, isError: false})
                break;
            
            default:
                setAlert({message: response.message, isError: true});
                break;
        }
        setPending(false);
    };

    const onDeleteRecipe = async () => {
        setIsModalVisible(false);
        setPending(true);

        const response = await deleteRecipe(recipe.id);

        switch (response.type) {
            case 'success':
                dispatch(recipesActions.deleteRecipe(recipe.id));
                router.replace('/recipes');
                return;

            default:
                setAlert({isError: true, message: response.message})
                break;
        }
        setPending(false);
    };

    return <div className="relative">
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
                Delete recipe <span className="b">{recipe.title}</span>?
        </ConfirmationModal>

        <PopUp alert={alert} setPopUp={setAlert}></PopUp>
    </div>
}