import { Recipe } from "@/helpers/types";
import getUserId from "@/helpers/cachers/token";
import AuthorDropdown from "./manage-btn/AuthorDropdown";
import ShoppingListButton from "./manage-btn/ShoppingListButton";
import { FillerButton } from "@/components/ui/elements/buttons";

export default function RecipeManageButton({recipe}: {recipe: Recipe}) {
    const userId = getUserId();

    if (userId) 
        return <div className="relative inline-block">
            {userId === recipe.authorId ? <AuthorDropdown recipe={recipe} /> : <ShoppingListButton recipe={recipe} />} 
        </div>

    return <FillerButton />
}