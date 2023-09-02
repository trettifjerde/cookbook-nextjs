import RecipeForm from "@/components/recipes/RecipeForm";
import { fetchRecipe } from "@/helpers/dataClient";
import { notFound } from "next/navigation";

export default async function RecipeFormPage({params}: {params: {id: string}}) {
    const recipe = await getRecipe(params.id);
    return <RecipeForm recipe={recipe} />
};

export async function getRecipe(id: string) {
    const recipe = await fetchRecipe(id);
    if ('error' in recipe) {
        notFound();
    }
    return recipe;
}