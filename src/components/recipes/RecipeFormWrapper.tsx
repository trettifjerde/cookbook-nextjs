import RecipeForm from "./RecipeForm";
import { makeEmptyRecipe } from "@/helpers/forms";

export default async function RecipeFormWrapper() {
    const recipe = makeEmptyRecipe();
    
    return <RecipeForm recipe={recipe} id='' />
}