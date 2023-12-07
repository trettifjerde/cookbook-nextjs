'use client';
import { AnimatePresence, motion } from 'framer-motion';
import RecipeItem from "./RecipeItem";
import { useStoreDispatch, useStoreSelector } from '@/store/store';
import { useEffect, useMemo } from 'react';
import { InitPreviewsBatch } from '@/helpers/types';
import { recipesActions } from '@/store/recipes';
import { usePathname } from 'next/navigation';

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

export default function RecipeList ({initPreviews}: { initPreviews: InitPreviewsBatch}) {
    const initialised = useStoreSelector(state => state.recipes.initialised);
    const previews = useStoreSelector(state => state.recipes.previews);
    const filterStr = useStoreSelector(state => state.recipes.filterStr);

    const pathname = usePathname();
    const dispatch = useStoreDispatch();

    const filteredRecipes = useMemo(() => {
        console.log('filtering recipes', initialised, previews, filterStr);
        if (!initialised)
            return initPreviews.previews;

        return previews.filter(p => p.title.includes(filterStr))
    }, [initialised, previews, filterStr]);

    useEffect(() => {
        if (!initialised)
            dispatch(recipesActions.initialise())
    }, []);

    useEffect(() => {
        console.log('init previews updated, dispatching in useeffect. current id', initPreviews.id);
        dispatch(recipesActions.syncPreviews(initPreviews))
    }, [initPreviews]);

    return (<div className="recipes-c">
        <AnimatePresence mode='wait'>

            {filteredRecipes.length > 0 && <motion.div className='recipes-c' 
                layout variants={itemVariants(0)} initial="hidden" animate="visible" exit="hidden">

                <AnimatePresence>
                    {filteredRecipes.map((r, i) => <motion.div layout key={r.id} 
                    variants={itemVariants(filteredRecipes.length - 1 - i)}
                    initial="hidden" animate="visible" exit="hidden">
                        <RecipeItem recipe={r} isActive={pathname.includes(r.id)}/>
                    </motion.div>) }
                </AnimatePresence>

            </motion.div>
            }

            {filteredRecipes.length === 0 && <motion.div layout key="recipes-empty" className='no-recipes' 
            variants={itemVariants(0)} initial="hidden" animate="visible" exit="hidden">
                No recipes found
            </motion.div>}

        </AnimatePresence>
    </div>)
}