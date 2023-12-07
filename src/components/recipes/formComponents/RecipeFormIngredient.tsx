import FormItem from "@/components/ui/FormItem";
import { FormIngredient, ING_AMOUNT, ING_NAME, ING_UNIT } from "@/helpers/types";
import {motion} from 'framer-motion';
import { listVariants } from "../RecipeForm";
import { ForwardedRef, forwardRef } from "react";

type Props = {
    errors: Set<string>, 
    ing: FormIngredient,
    removeIng: (id: string) => void,
    touchField: (value: string) => void
}

function getFieldName(ing: FormIngredient, fieldType: 'name' | 'amount' | 'unit') {
    return `${ing.id}${fieldType === 'amount' ? ING_AMOUNT : fieldType === 'unit' ? ING_UNIT : ING_NAME}`;
}

function RecipeFormIngredient({errors, ing, removeIng, touchField}: Props, ref: ForwardedRef<HTMLDivElement>) {

    return <motion.div ref={ref} layout className="row row-cols-auto align-items-center g-2 flex-nowrap ingred-cont"
        variants={listVariants} exit="exit" initial="initial" animate="animate">
        <div className="col flex-shrink-1">
            <FormItem type="number" name={getFieldName(ing, 'amount')} placeholder="amount"
            defaultValue={ing.amount} hasError={errors.has(getFieldName(ing, 'amount'))} registerTouch={touchField}/>
        </div>
        <div className="col flex-shrink-1">
            <FormItem type="text" name={getFieldName(ing, 'unit')} placeholder="unit"
            defaultValue={ing.unit} hasError={errors.has(getFieldName(ing, 'unit'))} registerTouch={touchField}/>
        </div>
        <div className="col flex-grow-1">
            <FormItem type="text" name={getFieldName(ing, 'name')} placeholder="name"
            defaultValue={ing.name} hasError={errors.has(getFieldName(ing, 'name'))} registerTouch={touchField} />
        </div>
        <div className="col flex-shrink-1">
            <button className="btn btn-outline-danger" type="button" onClick={() => removeIng(ing.id)}>X</button>
        </div>            
    </motion.div>
}

export default forwardRef(RecipeFormIngredient);