import { notFound } from "next/navigation";
import RecipeDetails from "@/components/recipes/RecipeDetails";
import { fetchRecipe } from "@/helpers/fetchers";
import RecipeSyncer from "@/components/recipes/RecipeSyncer";
import { fromRecipeToPreview } from "@/helpers/server/casters";

export default async function RecipeDetailsPage({params}: {params: {id: string}}) {
    const res = await fetchRecipe(params.id, 'DetailsPage');

    if (!res.ok)
        notFound();

    return <>
        <RecipeSyncer preview={fromRecipeToPreview(res.data)}/>
        <RecipeDetails recipe={res.data} />
    </>
    
};