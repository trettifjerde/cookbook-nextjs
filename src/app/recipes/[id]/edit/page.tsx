import RecipeForm from "@/components/recipes/RecipeForm";
import { getRecipe } from "@/helpers/dataClient";

export default async function RecipeFormPage({params}: {params: {id: string}}) {
    const recipe = await getRecipe(params.id);
    return <RecipeForm recipe={recipe} />
};
