import { redirect } from "next/navigation";
import getUserId from "@/helpers/server/cachers/token";
import { makeEmptyRecipe } from "@/helpers/client/validators/forms";
import RecipeForm from "@/components/recipes/RecipeForm";


export default function RecipeFormPage() {
    if (!getUserId())
        redirect('/auth/login');
    
    return <RecipeForm recipe={makeEmptyRecipe()} />
}