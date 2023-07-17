import RecipeDetails from "@/components/recipes/RecipeDetails";
import { fetchRecipe } from "@/helpers/dataClient";

export default async function RecipeDetailsPage({params}: {params: {id: string}}) {
    const recipe = await getRecipe(params.id)
    return <RecipeDetails recipe={recipe} />
};

async function getRecipe(id: string) {
    const recipe = await fetchRecipe(id);
    if ('error' in recipe) {
        throw new Error('Failed to fetch recipe');
    }
    return recipe;
}