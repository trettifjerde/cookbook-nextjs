'use client';
import { AnimatePresence, motion } from 'framer-motion';
import RecipeItem from "./RecipeItem";
import { RecipePreview } from '@/helpers/types';
import { usePathname } from 'next/navigation';

export const listVariants = {
    hidden: {
        transition: {
            staggerChildren: 0.1, 
            staggerDirection: -1,
            duration: 0
        }
    },
    visible: {
        transition: {
            staggerChildren: 0.1, 
            staggerDirection: -1,
            duration: 0
        }
    }
};

export const itemVariants = (n: number) => ({
    hidden: {
        opacity: 0,
        scale: 0.8,
        transition: {
            duration: 0.2,
            delay: 0.1 * n
        }
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.2,
            delay: 0.1 * n
        }
    }
})


const RecipeList = ({filterString, recipes}: {recipes: RecipePreview[], filterString: string}) => {
    const filteredRecipes = recipes.filter(recipe => recipe.name.toLowerCase().includes(filterString));
    const pathname = usePathname();

    return (<motion.div className="recipes-c" variants={listVariants} initial="hidden" exit="hidden" animate="visible">
            <AnimatePresence>
                {filteredRecipes.map((r, i) => <motion.div key={r.id} layout 
                variants={itemVariants(filteredRecipes.length - 1 - i)}
                initial="hidden" animate="visible" exit="hidden">
                    <RecipeItem recipe={r} isActive={pathname.endsWith(r.id)}/>
                </motion.div>) }
                {filteredRecipes.length === 0 && <motion.div key="recipes-btn" variants={itemVariants(0)}>
                    <div className="empty">No recipes found</div>
                </motion.div>}
            </AnimatePresence>
        </motion.div> 
    )
}
export default RecipeList;