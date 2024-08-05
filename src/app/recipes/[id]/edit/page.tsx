import RecipeForm from "@/components/recipes/RecipeForm";
import { fetchRecipe } from "@/helpers/fetchers";
import getUserId from "@/helpers/server/cachers/token";
import { fromRecipeToForm } from "@/helpers/server/casters";
import { notFound, redirect } from "next/navigation";

export default async function RecipeFormPage({params}: {params: {id: string}}) {

    const userId = getUserId();
    if (!userId)
        redirect('/auth/login');

    const response = await fetchRecipe(params.id, 'FormPage');
    if (!response.ok)
        notFound();

    const recipe = response.data;
    if (recipe.authorId !== userId)
        redirect(`/recipes/${recipe.id}`);

    const {form, id} = fromRecipeToForm(recipe);
    
    return <RecipeForm recipe={form} id={id} />
};