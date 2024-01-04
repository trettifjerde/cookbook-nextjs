'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useStoreDispatch, useStoreSelector } from '@/store/store';
import { recipesActions } from '@/store/recipes';
import { InitPreviewsBatch } from '@/helpers/types';
import RecipeItem from "./RecipeItem";

export default function RecipeList({initPreviews}: { initPreviews: InitPreviewsBatch}) {
    
    const initialised = useStoreSelector(state => state.recipes.initialised);
    const previews = useStoreSelector(state => state.recipes.previews);
    const filterStr = useStoreSelector(state => state.recipes.filterStr);

    const pathname = usePathname();
    const dispatch = useStoreDispatch();

    const filteredRecipes = useMemo(() => {
        console.log('filtering recipes', initialised, previews, filterStr);
        if (initialised)
            return previews.filter(p => p.title.toLowerCase().includes(filterStr));
        
        return initPreviews.previews;

    }, [initialised, previews, filterStr]);

    useEffect(() => {
        console.log('init previews updated, dispatching in useeffect. current id', initPreviews.id);
        dispatch(recipesActions.syncPreviews(initPreviews));
    }, [initPreviews]);

    return <AnimatePresence mode='wait'>

        {
            filteredRecipes.length === 0 && <motion.div key="recipes-empty" 
                className='h-recipe-item-sm md:max-lg:h-recipe-item-md flex items-center justify-center' 
                variants={itemVariants(0)} initial="hidden" animate="visible" exit="hidden">
                    No recipes found
            </motion.div>
        }

        {
            filteredRecipes.length > 0 && <motion.div key='recipes' className='h-full flex flex-col-reverse justify-end gap-2'>
            { 
                filteredRecipes.map((r, i) => <motion.div key={r.id} 
                    variants={itemVariants(filteredRecipes.length - 1 - i)}
                    initial="hidden" animate="visible" exit="hidden">

                        <RecipeItem recipe={r} isActive={pathname.includes(r.id)}/>

                    </motion.div>) 
            }
            </motion.div>
        }
    </AnimatePresence>
}

export const itemVariants = (n: number) => ({
    hidden: {
        opacity: 0,
        scale: 0.8,
        transition: {
            duration: 0.2,
            delay: 0.13 * n
        }
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.2,
            delay: 0.13 * n
        }
    }
})