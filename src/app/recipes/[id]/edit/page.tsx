import RecipeForm from "@/components/recipes/RecipeForm";
import { fromRecipeToForm } from "@/helpers/casters";
import { fetchRecipe } from "@/helpers/fetchers";
import { notFound } from "next/navigation";

export default async function RecipeFormPage({params}: {params: {id: string}}) {

    const response = await fetchRecipe(params.id, 'RecipeFormPage');

    switch (response.type) {
        case 'error':
            notFound();

        case 'success':
            const {form, id} = fromRecipeToForm(response.data);
            return <RecipeForm recipe={form} id={id} />
    }
};