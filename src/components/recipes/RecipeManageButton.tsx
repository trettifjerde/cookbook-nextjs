import { Recipe } from "@/helpers/types";
import getUserId from "@/helpers/cachers/token";
import ShoppingListButton from "./manage/ShoppingListButton";
import AuthorDropdown from "./manage/AuthorDropdown";

export default function RecipeManageButton({recipe}: {recipe: Recipe}) {
    console.log('about to get userId: recipe manage btn');
    const userId = getUserId();

    if (userId) 
        return <div className="relative inline-block">
            {userId === recipe.authorId ? <AuthorDropdown recipe={recipe} /> : <ShoppingListButton recipe={recipe} />} 
        </div>

    return <></>
}