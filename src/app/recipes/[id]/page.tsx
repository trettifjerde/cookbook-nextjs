import { notFound } from "next/navigation";
import RecipeDetails from "@/components/recipes/RecipeDetails";
import { fetchRecipe } from "@/helpers/fetchers";

export default async function RecipeDetailsPage({params}: {params: {id: string}}) {
    const response = await fetchRecipe(params.id, 'RecipeDetailsPage');

    switch (response.type) {
        case 'error':
            notFound();

        case 'success':
            return <RecipeDetails recipe={response.data} />
    }
};