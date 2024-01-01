import FormSkeleton from "@/components/recipes/FormSkeleton";
import RecipeForm from "@/components/recipes/RecipeForm";
import { makeEmptyRecipe } from "@/helpers/forms";

export default function RecipeFormPage() {
    return <FormSkeleton title="Add recipe" />
    //return <RecipeForm recipe={makeEmptyRecipe()} />
}