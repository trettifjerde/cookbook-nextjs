import { ReactNode, } from 'react';
import RecipesFrame from '@/components/recipes/RecipesFrame';
import RecipesLoadMoreButton from '@/components/recipes/RecipeLoadMoreButton';
import RecipeList from '@/components/recipes/RecipeList';
import { initRecipePreviews } from '@/helpers/init-recipe-cache';
import RecipesSearchBar from '@/components/recipes/RecipesSearchBar';

export default async function RecipesLayout({children}:{children: ReactNode}) {
    const initPreviews = await initRecipePreviews();
    
    return <RecipesFrame>

        <RecipesSearchBar />

        <div className="grid grid-cols-3-5 overflow-hidden">
            <aside className="pr-5 grid grid-rows-auto-full gap-2 overflow-auto">
                <RecipesLoadMoreButton/>
                <RecipeList initPreviews={initPreviews}/>
            </aside>
            <article className='pr-3 overflow-auto'>
                {children}
            </article>
        </div>

    </RecipesFrame>
};