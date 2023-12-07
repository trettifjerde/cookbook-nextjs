import { ReactNode, } from 'react';
import RecipesFrame from '@/components/recipes/RecipesFrame';
import Link from 'next/link';
import RecipesFilter from '@/components/recipes/RecipesFilter';
import RecipesLoadMoreButton from '@/components/recipes/RecipeLoadMoreButton';
import RecipeList from '@/components/recipes/RecipeList';
import { initRecipePreviews } from '@/helpers/init-recipe-cache';

export default async function RecipesLayout({children}:{children: ReactNode}) {
    const initPreviews = await initRecipePreviews();
    
    return <RecipesFrame>
        <div className="row align-items-center search-bar">
            <div className="col-auto">
                <Link href="/recipes/new" className="btn btn-success">New Recipe</Link>
            </div>
            <RecipesFilter/>
        </div>
        <div className="row mb-3">
            <aside className="col-md-5 side">
                <RecipesLoadMoreButton/>
                <RecipeList initPreviews={initPreviews}/>
            </aside>
            <article className="col-md-7 main">
                {children}
            </article>
        </div>
    </RecipesFrame>
};