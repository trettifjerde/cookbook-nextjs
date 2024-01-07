'use client'

import { memo, useMemo, useState } from "react";
import { useStoreDispatch, useStoreSelector } from "@/store/store";
import { recipesActions } from "@/store/recipes";
import { RECIPE_PREVIEW_BATCH_SIZE } from "@/helpers/config";
import { fetchMorePreviews } from "@/helpers/fetchers";
import { SpinnerButton } from "../ui/elements/buttons";
import { generalActions } from "@/store/general";
import { Alert } from "@/helpers/types";

function RecipesLoadMoreButton() {
    const lastId = useStoreSelector(state => state.recipes.lastId);
    const dispatch = useStoreDispatch();

    const [fetching, setFetching] = useState(false);
    const [hasMoreRecipes, setHasMoreRecipes] = useState(true);
    const loadBtnText = useMemo(() => hasMoreRecipes ? 'Load more recipes' : 'No more recipes to load', [hasMoreRecipes]);

    const loadMoreRecipes = async () => {
        setFetching(true);

        const res = await fetchMorePreviews(lastId);
        
        switch (res.type) {
            case 'success':
                const areRecipesLeft = res.data.length === RECIPE_PREVIEW_BATCH_SIZE;
                
                if (!areRecipesLeft)
                    setTimeout(() => setHasMoreRecipes(true), 30 * 1000);
                
                setHasMoreRecipes(areRecipesLeft);
                
                if (res.data.length > 0) 
                    dispatch(recipesActions.addMoreRecipes(res.data));
                    
                break;
                
            default: 
                dispatch(generalActions.setError('Could not fetch more recipes'));
        }
        setFetching(false);
    }

    return <SpinnerButton type="button" className="w-full overflow-hidden shadow-alert rounded-md" color="green" disabled={fetching || !hasMoreRecipes} pending={fetching} onClick={loadMoreRecipes}>
        {loadBtnText}
    </SpinnerButton>
};

export default memo(RecipesLoadMoreButton);