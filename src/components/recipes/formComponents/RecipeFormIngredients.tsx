import { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RECIPE_ING_ID } from "@/helpers/forms";
import { FormIngredient, RecipeIngredient } from "@/helpers/types";
import RecipeFormIngredient from "./RecipeFormIngredient";
import RecipeFormGroup from "./RecipeFormGroup";
import { Button } from "@/components/ui/elements/buttons";
import useListManager from "@/helpers/hooks/useListManger";

type Props = {
    errors: Set<string>, 
    ingredients: RecipeIngredient[], 
    touchField: (key: string, value: string) => void
};

export default function RecipeFormIngredients({errors, ingredients, touchField}: Props) {
    const {list, addItem, removeItem} = useListManager(ingredients, makeNewIng);
    const registerTouch = useCallback((v: string) => touchField('ingredients', v), [touchField]);
    
    return <RecipeFormGroup label="Ingredients" errorMsg="Ingredients are required" hasError={errors.size > 0}>
        <div>
            <AnimatePresence mode="popLayout" initial={false}>
                { list.map(ing => <RecipeFormIngredient key={ing.id} ing={ing} 
                    errors={errors} removeIng={removeItem} touchField={registerTouch} />) }

                <motion.div key="add-btn" layout className="mt-4">
                    <Button type="button" color="greenOutline" onClick={addItem}>
                        Add new ingredient
                    </Button>
                </motion.div>
            </AnimatePresence>  
        </div>
    </RecipeFormGroup>
}

function makeNewIng(i: number, ing?: RecipeIngredient) {
    return {
        id: RECIPE_ING_ID(i),
        name: ing?.name || '',
        amount: ing?.amount?.toString() || '',
        unit: ing?.unit || ''
    } as FormIngredient
};