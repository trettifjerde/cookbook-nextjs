import { verifyToken } from "@/helpers/server-helpers";
import { Recipe } from "@/helpers/types";
import { cookies } from "next/headers";
import ShoppingListButton from "./ShoppingListButton";
import AuthorDropdown from "./AuthorDropdown";

export default function RecipeManageButton({recipe}: {recipe: Recipe}) {
    const userId = verifyToken(cookies(), 'RecipeManageButton');

    if (userId) {
        if (userId === recipe.authorId) 
            return <AuthorDropdown recipe={recipe} />
        else 
            return <ShoppingListButton ingredients={recipe.ingredients} />
    }

    return <></>
}