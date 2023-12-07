'use client'

import { memo, useMemo, useState } from "react";
import { useStoreDispatch, useStoreSelector } from "@/store/store";
import { recipesActions } from "@/store/recipes";
import { RECIPE_PREVIEW_BATCH_SIZE } from "@/helpers/config";
import { fetchMorePreviews } from "@/helpers/fetchers";
import MiniSpinner from "../ui/MiniSpinner/MiniSpinner";

const RecipesLoadMoreButton = memo(() => {
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
                console.log('load more error message', res.message);
        }
        setFetching(false);
    }

    return <div className="r">
        <button type="button" className="btn btn-success w-100" 
            disabled={!hasMoreRecipes} onClick={loadMoreRecipes}>
                {loadBtnText}
        </button>
        {fetching && <MiniSpinner absolute />}  
    </div>
});

export default RecipesLoadMoreButton;