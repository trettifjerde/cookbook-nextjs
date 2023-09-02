import RecipeDetails from "@/components/recipes/RecipeDetails";
import { fetchRecipe } from "@/helpers/dataClient";
import { notFound } from "next/navigation";

export default async function RecipeDetailsPage({params}: {params: {id: string}}) {
    const recipe = await getRecipe(params.id);
    return <RecipeDetails recipe={recipe} />
};

export async function getRecipe(id: string) {
    const recipe = await fetchRecipe(id);
    if ('error' in recipe) {
        notFound();
    }
    return recipe;
}