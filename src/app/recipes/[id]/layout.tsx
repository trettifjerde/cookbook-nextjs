import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { fetchRecipe } from "@/helpers/fetchers";
import { fromRecipeToPreview } from "@/helpers/server/casters";
import RecipeSyncer from "@/components/recipes/RecipeSyncer";

export default async function RecipeLayout({params, children}: {params: {id: string}, children: ReactNode}) {

    const res = await fetchRecipe(params.id, 'Recipe Layout');

    if (!res.ok)
        notFound();

    return <>
        <RecipeSyncer preview={fromRecipeToPreview(res.data)} />
        {children}
    </>
}