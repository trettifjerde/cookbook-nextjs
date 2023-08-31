import { ReactNode, } from 'react';
import Recipes from '@/components/recipes/Recipes';
import { fetchRecipes } from '@/helpers/dataClient';

export default async function RecipePage({children}:{children: ReactNode}) {
    const recipes = await getRecipes();

    return <Recipes recipes={recipes}>{children}</Recipes>
};

async function getRecipes() {
    const recipes = await fetchRecipes(); 
    if ('error' in recipes) {
        throw new Error('Failed to fetch recipes');
    }
    return recipes;
}

