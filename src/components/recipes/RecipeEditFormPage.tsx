import { notFound } from "next/navigation";
import { fromRecipeToPreview } from "@/helpers/server/casters";
import { fetchRecipe } from "@/helpers/fetchers";
import RecipeFormClient from "./form/RecipeFormClient";
import RecipeSyncer from "./RecipeSyncer";

export default async function RecipeEditFormPage({id}: {id: string}) {

    const res = await fetchRecipe(id, 'RecipeEditFormPage');
    if (!res.ok)
        notFound();

    const recipe = res.data;

    return <>
        <RecipeSyncer preview={fromRecipeToPreview(recipe)} />
        <RecipeFormClient recipe={recipe} id={id} />
    </>
}
