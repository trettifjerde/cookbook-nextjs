import RecipeForm from "@/components/recipes/RecipeForm";
import { fetchRecipe } from "@/helpers/dataClient";

export default async function RecipeFormPage({params}: {params: {id: string}}) {
    const recipe = await getRecipe(params.id);
    return <RecipeForm recipe={recipe} />
};

async function getRecipe(id: string) {
    const recipe = await fetchRecipe(id);
    if ('error' in recipe) {
        throw new Error('Failed to fetch recipe');
    }
    return recipe;
}