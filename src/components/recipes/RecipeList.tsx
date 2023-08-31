'use client';
import { AnimatePresence, motion } from 'framer-motion';
import RecipeItem from "./RecipeItem";
import { RecipePreview } from '@/helpers/types';
import { usePathname } from 'next/navigation';

export const listVariants = {
    hidden: {
        transition: {
            //staggerChildren: 0.1, 
            //staggerDirection: -1
            duration: 0
        }
    },
    visible: {
        transition: {
            //staggerChildren: 0.1, 
            //staggerDirection: -1
            duration: 0
        }
    }
};

export const itemVariants = {
    hidden: {
        opacity: 0,
        scale: 0.7,
        transition: {
            duration: 0.2
        }
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.2
        }
    }
}


const RecipeList = ({filterString, recipes}: {recipes: RecipePreview[], filterString: string}) => {
    const filteredRecipes = recipes.filter(recipe => recipe.name.toLowerCase().includes(filterString));
    const pathname = usePathname();

    return (
        <motion.div className="recipes-c fadeIn" variants={listVariants} initial="hidden" exit="hidden" animate="visible">
            <AnimatePresence>
                {filteredRecipes.map(r => <RecipeItem key={r.id} recipe={r} isActive={pathname.endsWith(r.id)}/>) }
                {filteredRecipes.length === 0 && <motion.div key="recipes-btn" variants={itemVariants}>
                    <div className="empty">No recipes found</div>
                </motion.div>}
            </AnimatePresence>
        </motion.div> 
    )
}
export default RecipeList;