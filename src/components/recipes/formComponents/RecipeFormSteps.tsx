import { RECIPE_STEP_ID } from "@/helpers/forms";
import { AnimatePresence } from "framer-motion";
import RecipeFormStep from "./RecipeFormStep";
import { useCallback } from "react";
import RecipeFormGroup from "./RecipeFormGroup";
import { Button } from "@/components/ui/elements/buttons";
import useListManager from "@/helpers/hooks/useListManger";

type Props = {
    steps: string[],
    errors: Set<string>,
    touchField: (key: string, value: string) => void
}

export default function RecipeFormSteps({steps, errors, touchField}: Props) {

    const {list, addItem, removeItem, moveItem} = useListManager(steps, makeNewStep);
    const registerTouch = useCallback((v: string) => touchField('steps', v), [touchField]);
    
    return <RecipeFormGroup label="Steps" hasError={errors.size > 0} errorMsg="Steps cannot be empty or longer than 1000 characters each">
        <ol className="list-decimal list-inside divide-y">

            <AnimatePresence mode="popLayout" initial={false}>
                { list.map(step => <RecipeFormStep key={step.id} 
                    step={step} errors={errors} removeStep={removeItem} moveStep={moveItem} touchField={registerTouch} />)} 
            </AnimatePresence>

        </ol>
        <div>
            <Button type="button" color="greenOutline" onClick={addItem}>
                Add new step
            </Button>
        </div>
    </RecipeFormGroup>
}

function makeNewStep(i: number, step?: string) {
    return {id: RECIPE_STEP_ID(i), step: step || ''};
};