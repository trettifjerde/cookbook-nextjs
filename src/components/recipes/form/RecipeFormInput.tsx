import { Input, Textarea } from "@/components/ui/elements/forms";
import { useCallback } from "react";

type Props = {
    name: string,
    hasError: boolean,
    placeholder?: string,
    defaultValue: string,
    type: 'textarea' | 'text' | 'number',
    touchField: (key: string, value: string) => void,
    disabled?: boolean
}

export const recipeLabelClass = "font-bold text-md";

const RecipeFormInput = ({type, name, hasError, defaultValue, placeholder, touchField, disabled}: Props) => {

    const registerTouch = useCallback(() => touchField('general', name), [touchField, name]);

    return type === 'textarea' ? <Textarea name={name} id={name} 
            disabled={disabled} invalid={hasError} 
            defaultValue={defaultValue} onFocus={registerTouch} /> :

        <Input type={type} name={name} id={name} placeholder={placeholder}
            disabled={disabled} invalid={hasError}
            defaultValue={defaultValue} onFocus={registerTouch}/>
};

// export default memo(RecipeFormInput);
export default RecipeFormInput;