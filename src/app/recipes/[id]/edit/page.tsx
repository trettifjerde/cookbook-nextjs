import RecipeForm from "@/components/recipes/RecipeForm";
import { fetchRecipe } from "@/helpers/fetchers";
import { fromRecipeToForm } from "@/helpers/server-helpers";
import { notFound } from "next/navigation";

export default async function RecipeFormPage({params}: {params: {id: string}}) {

    const response = await fetchRecipe(params.id, 'RecipeFormPage');

    switch (response.type) {
        case 'error':
            console.log(response.message);
            notFound();

        case 'success':
            const {form, id} = fromRecipeToForm(response.data);
            return <RecipeForm recipe={form} id={id} />
    }
};