'use client'

import { memo, useMemo, useState } from "react";
import { useStoreDispatch, useStoreSelector } from "@/store/store";
import { recipesActions } from "@/store/recipes";
import { generalActions } from "@/store/general";
import { RECIPE_PREVIEW_BATCH_SIZE } from "@/helpers/config";
import { fetchMorePreviews } from "@/helpers/fetchers";
import { SpinnerButton } from "../ui/elements/buttons";

function RecipesLoadMoreButton() {
    const lastId = useStoreSelector(state => state.recipes.lastId);
    const dispatch = useStoreDispatch();

    const [fetching, setFetching] = useState(false);
    const [hasMoreRecipes, setHasMoreRecipes] = useState(true);
    const [loadMoreIcon, loadMoreText] = useMemo(() => hasMoreRecipes ? [
        'icon-spinner', 'Load more recipes'
    ] : [
        'icon-blocked', 'No more recipes to load'
    ], [hasMoreRecipes]);

    const loadMoreRecipes = async () => {
        setFetching(true);

        const res = await fetchMorePreviews(lastId);

        if (!res.ok)
            dispatch(generalActions.setError('Could not fetch more recipes'));

        else {
            const fetchedBatch = res.data;
            const areRecipesLeft = fetchedBatch.length === RECIPE_PREVIEW_BATCH_SIZE;
            
            if (!areRecipesLeft)
                setTimeout(() => setHasMoreRecipes(true), 30 * 1000);
            
            setHasMoreRecipes(areRecipesLeft);
            
            if (fetchedBatch.length > 0) 
                dispatch(recipesActions.addMoreRecipes(fetchedBatch));                
        }
        setFetching(false);
    }

    return <SpinnerButton type="button" className="w-full overflow-hidden shadow-alert rounded-md" 
        color="green" 
        disabled={fetching || !hasMoreRecipes} pending={fetching} 
        onClick={loadMoreRecipes}>
            <i className={loadMoreIcon} />
            <span>{loadMoreText}</span>
    </SpinnerButton>
};

export default memo(RecipesLoadMoreButton);