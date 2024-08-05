'use client';

import { RecipePreview } from "@/helpers/types";
import { recipesActions } from "@/store/recipes";
import { useStoreDispatch } from "@/store/store";
import { useEffect } from "react";

export default function RecipeSyncer({preview}: {preview: RecipePreview}) {
    const dispatch = useStoreDispatch();

    useEffect(() => {
        if (preview)
            dispatch(recipesActions.syncRecipe(preview));
    }, [preview]);
    return <></>
}