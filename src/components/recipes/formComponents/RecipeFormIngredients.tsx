import { RECIPE_INGREDIENTS, RECIPE_ING_ID } from "@/helpers/forms";
import { FirebaseIngredient, FormIngredient } from "@/helpers/types";
import useListManager from "@/helpers/useListManger";
import { AnimatePresence, MotionConfig } from "framer-motion";
import RecipeFormIngredient from "./RecipeFormIngredient";
import { useCallback } from "react";


type Props = {
    errors: Set<string>, 
    ingredients: FirebaseIngredient[], 
    touchField: (key: string, value: string) => void
};
export default function RecipeFormIngredients({errors, ingredients, touchField}: Props) {
    const {list, addItem, removeItem} = useListManager(ingredients, makeNewIng);

    const registerTouch = useCallback((v: string) => touchField('ingredients', v), [touchField]);
    
    return <div className="form-group">
        <div className="label-row">
            <label>Ingredients</label>
            { errors.size > 0 && <p className="form-text text-danger">
                Ingredients are required
            </p>}
        </div>
        <AnimatePresence mode="popLayout">
            { list.map(ing => <RecipeFormIngredient key={ing.id} ing={ing} 
                errors={errors} removeIng={removeItem} touchField={registerTouch} />) }
            <button type="button" className="btn btn-outline-success mt-2" onClick={addItem}>
                Add new ingredient
            </button>
        </AnimatePresence>  
    </div>
}

function makeNewIng(i: number, ing?: FirebaseIngredient) {
    return {
        id: RECIPE_ING_ID(i),
        name: ing?.name || '',
        amount: ing?.amount?.toString() || '',
        unit: ing?.unit || ''
    } as FormIngredient
};