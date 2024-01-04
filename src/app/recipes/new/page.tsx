import RecipeForm from "@/components/recipes/RecipeForm";
import { makeEmptyRecipe } from "@/helpers/forms";

export default function RecipeFormPage() {
    return <RecipeForm recipe={makeEmptyRecipe()} />
}