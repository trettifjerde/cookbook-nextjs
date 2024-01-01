import { ReactNode, } from 'react';
import RecipesFrame from '@/components/recipes/RecipesFrame';
import RecipesLoadMoreButton from '@/components/recipes/RecipeLoadMoreButton';
import RecipeList from '@/components/recipes/RecipeList';
import { initRecipePreviews } from '@/helpers/init-recipe-cache';

export default async function RecipesLayout({children}:{children: ReactNode}) {
    const initPreviews = await initRecipePreviews();
    
    return <RecipesFrame>
        <div className="grow grid md:grid-cols-3-5 gap-2 overflow-hidden">
            <aside className="p-1 relative h-full md:pr-3 flex flex-col gap-2 overflow-auto">
                <div className='sticky top-0 z-10'>
                    <RecipesLoadMoreButton/>
                </div>
                <div className="relative grow z-0">
                    <RecipeList initPreviews={initPreviews}/>
                </div>
            </aside>
            <article className='md:pr-3 overflow-auto'>
                {children}
            </article>
        </div>
    </RecipesFrame>
};