import { motion } from 'framer-motion';
import { listVariants } from './RecipeFormClient';
import { forwardRef } from 'react';
import { Textarea } from '@/components/ui/elements/forms';
import { Button } from '@/components/ui/elements/buttons';

type Props = {
    step: {id: string, step: string}, 
    errors: Set<string>, 
    removeStep: (id: string) => void,
    moveStep: (id: string, n: number) => void,
    touchField: (value: string) => void
};

const RecipeFormStep = forwardRef<HTMLLIElement, Props>(({step, errors, removeStep, moveStep, touchField}, ref) => {
   
    return <motion.li ref={ref} layout className="flex flex-row flex-nowrap gap-2 items-center py-3"
        variants={listVariants} initial="initial" animate="animate" exit="exit">
            <div className="flex flex-col gap-1 items-center">
                <div className="list-item text-green font-medium min-w-btn-square aspect-square text-center leading-10"></div>
                <Button type="button" color='redOutline' shape='square' onClick={() => removeStep(step.id)}>
                    <i className='icon-cross' />    
                </Button>      
            </div>
            <div className="grow">
                <Textarea name={step.id} id={step.id} invalid={errors.has(step.id)} 
                    onFocus={() => touchField(step.id)} defaultValue={step.step} />
            </div>
            <div className="flex flex-col gap-1">
                <Button type="button" color="greenOutline" shape="square" onClick={() => moveStep(step.id, -1)}>
                    <i className='icon-arrow-up' />
                </Button>
                <Button type="button" color="greenOutline" shape="square" onClick={() => moveStep(step.id, 1)}>
                    <i className='icon-arrow-down' />    
                </Button>      
            </div>
    </motion.li>
})

// export default memo(RecipeFormStep);
export default RecipeFormStep;