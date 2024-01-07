'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, Transition, Variants, motion } from 'framer-motion';
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

        if (initialised)
            return previews.filter(p => p.title.toLowerCase().includes(filterStr));
        
        return initPreviews.previews;

    }, [initialised, previews, filterStr]);

    useEffect(() => {
        console.log('current init previews id:', initPreviews.id);
        dispatch(recipesActions.syncPreviews(initPreviews));
    }, [initPreviews]);

    return <AnimatePresence mode='wait'>

        {
            filteredRecipes.length === 0 && <motion.div key="recipes-empty" 
                className='min-h-recipe-item-sm md:max-lg:min-h-recipe-item-md flex items-center justify-center' 
                variants={container} initial="hidden" animate="visible" exit="hidden" transition={containerTransition}>
                    No recipes found
            </motion.div>
        }

        {
            filteredRecipes.length > 0 && <motion.div key="recipes" className='h-full flex flex-col-reverse justify-end gap-2'
                variants={container} initial="hidden" animate="visible" exit="hidden" transition={containerTransition}>

                <AnimatePresence>
                    { 
                        filteredRecipes.map((r, i) => <motion.div layout key={r.id} 
                            custom={i}
                            variants={item} initial="hidden" animate="visible" exit="hidden"
                        >

                            <RecipeItem recipe={r} isActive={pathname.includes(r.id)}/>

                        </motion.div>) 
                    }
                </AnimatePresence>
            </motion.div>
        }
    </AnimatePresence>
}

const container : Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            when: 'beforeChildren'
        }
    }
};
const containerTransition: Transition = {type: 'tween', duration: 0.2}

const item : Variants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
    },
    visible: (i) => ({
        opacity: 1,
        scale: 1,
        transition: {
            type: 'tween',
            duration: 0.2,
            delay: 0.1 * i
        }
    })
};