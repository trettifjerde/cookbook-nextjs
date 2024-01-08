import { forwardRef } from "react";
import {motion} from 'framer-motion';
import { FormIngredient, ING_AMOUNT, ING_NAME, ING_UNIT } from "@/helpers/types";
import { Input } from "@/components/ui/elements/forms";
import { Button } from "@/components/ui/elements/buttons";
import { listVariants } from "../RecipeForm";

type Props = {
    errors: Set<string>, 
    ing: FormIngredient,
    removeIng: (id: string) => void,
    touchField: (value: string) => void
}
type FieldType = typeof ING_AMOUNT | typeof ING_NAME | typeof ING_UNIT;

const getFieldName = (ing: FormIngredient, fieldType: FieldType) => `${ing.id}${fieldType}`;

function IngredientField({type, invalid, name, touchField, placeholder, defaultValue, className} : {
    type: 'number' | 'text',
    invalid: boolean,
    placeholder: string,
    name: string,
    touchField: (value: string) => void,
    defaultValue: string,
    className: string
}) {

    return <div className={className}>
        <Input type={type} name={name} id={name} placeholder={placeholder}
            defaultValue={defaultValue} invalid={invalid} onFocus={() => touchField(name)}/>
    </div>
};

const RecipeFormIngredient = forwardRef<HTMLDivElement, Props>(({errors, ing, removeIng, touchField}, ref) => {

    return <motion.div ref={ref} layout className="flex flex-row items-center gap-1 flex-nowrap my-1"
        variants={listVariants} exit="exit" initial="initial" animate="animate">

            <IngredientField type="number" className="shrink"
                name={getFieldName(ing, ING_AMOUNT)} placeholder={ING_AMOUNT} 
                defaultValue={ing.amount} invalid={errors.has(getFieldName(ing, ING_AMOUNT))} touchField={touchField} />

            <IngredientField type="text" className="shrink"
                name={getFieldName(ing, ING_UNIT)} placeholder={ING_UNIT}
                defaultValue={ing.unit} invalid={errors.has(getFieldName(ing, ING_UNIT))} touchField={touchField}/>

            <IngredientField type="text" className="grow"
                name={getFieldName(ing, 'name')} placeholder="name"
                defaultValue={ing.name} invalid={errors.has(getFieldName(ing, 'name'))} touchField={touchField} />

            <div>
                <Button color="red" shape="square" type="button" onClick={() => removeIng(ing.id)}>
                    <i className="icon-cross" />
                </Button>
            </div>  

    </motion.div>
})

// export default memo(RecipeFormIngredient);
export default RecipeFormIngredient;