import {motion} from 'framer-motion';
import { listVariants } from '../RecipeForm';
import FormItem from '@/components/ui/FormItem';
import { ForwardedRef, forwardRef } from 'react';

type Props = {
    step: {id: string, step: string}, 
    errors: Set<string>, 
    removeStep: (id: string) => void,
    moveStep: (id: string, n: number) => void,
    touchField: (value: string) => void
};

function RecipeFormStep({step, errors, removeStep, moveStep, touchField}: Props, ref: ForwardedRef<HTMLLIElement>) {
   
    return <motion.li ref={ref} layout className="list-group-item row step"
    variants={listVariants} initial="initial" animate="animate" exit="exit">
        <div className="col-auto step-num-n-del">
            <div className="btn order-btn"></div>
            <button className="btn btn-outline-danger" type="button" onClick={() => removeStep(step.id)}>X</button>      
        </div>
        <div className="col-md-8 step-area">
            <FormItem type='textarea' name={step.id} hasError={errors.has(step.id)} registerTouch={touchField} defaultValue={step.step} />
        </div>
        <div className="col-auto step-move-btns">
            <button className="btn btn-outline-success" type="button" onClick={() => moveStep(step.id, -1)}>🡅</button>
            <button className="btn btn-outline-success" type="button" onClick={() => moveStep(step.id, 1)}>🡇</button>      
        </div>
    </motion.li>
}

export default forwardRef(RecipeFormStep);