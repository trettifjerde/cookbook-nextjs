import { makeFormRecipe } from "@/helpers/casters";
import RecipeForm from "@/components/recipes/RecipeForm";

export default function RecipeFormPage() {
    const recipe = makeFormRecipe();

    return <RecipeForm recipe={recipe}/>

};