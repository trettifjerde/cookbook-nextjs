import { notFound } from "next/navigation";
import RecipeDetails from "@/components/recipes/RecipeDetails";
import { fetchRecipe } from "@/helpers/fetchers";

export default async function RecipeDetailsPage({params}: {params: {id: string}}) {
    const res = await fetchRecipe(params.id, 'DetailsPage');

    if (!res.ok)
        notFound();

    return <RecipeDetails recipe={res.data} />
};