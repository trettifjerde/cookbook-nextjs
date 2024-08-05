import { redirect } from "next/navigation";
import getUserId from "@/helpers/server/cachers/token";
import { makeEmptyRecipe } from "@/helpers/client/validators/forms";
import RecipeFormClient from "@/components/recipes/form/RecipeFormClient";

export const dynamic = 'force-dynamic';

export default function NewRecipePage() {
    if (!getUserId())
        redirect('/auth/login');
    else     
        return <RecipeFormClient recipe={makeEmptyRecipe()} />
}