import { RECIPE_STEP_ID } from "@/helpers/forms";
import { AnimatePresence } from "framer-motion";
import RecipeFormStep from "./RecipeFormStep";
import useListManager from "@/helpers/useListManger";
import { useCallback } from "react";

type Props = {
    steps: string[],
    errors: Set<string>,
    touchField: (key: string, value: string) => void
}

export default function RecipeFormSteps({steps, errors, touchField}: Props) {
    const {list, addItem, removeItem, moveItem} = useListManager(steps, makeNewStep);

    const registerTouch = useCallback((v: string) => touchField('steps', v), [touchField]);
    
    return <div className="form-group">
        <div className="label-row">
            <label>Steps</label>
            { errors.size > 0 && <p className="form-text text-danger">
                Steps cannot be empty or longer than 1000 characters each
            </p>}
        </div>
        <ol className="list-group list-group-flush steps">
            <AnimatePresence mode="popLayout" initial={false}>
            { list.map(step => <RecipeFormStep key={step.id} step={step} errors={errors} removeStep={removeItem} moveStep={moveItem} touchField={registerTouch} />)} 
            </AnimatePresence>
        </ol>
        <button type="button" className="btn btn-outline-success" onClick={addItem}>
            Add new step
        </button>
    </div>
}

function makeNewStep(i: number, step?: string) {
    return {id: RECIPE_STEP_ID(i), step: step || ''};
};