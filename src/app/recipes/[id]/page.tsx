import RecipeDetails from "@/components/recipes/RecipeDetails";
import { getRecipe } from "@/helpers/dataClient";

export default async function RecipeDetailsPage({params}: {params: {id: string}}) {
    const recipe = await getRecipe(params.id);
    return <RecipeDetails recipe={recipe} />
};
