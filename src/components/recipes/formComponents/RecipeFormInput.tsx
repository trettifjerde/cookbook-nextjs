import FormItem from "@/components/ui/FormItem";
import { memo, useCallback } from "react";

type Props = {
    label: string,
    name: string,
    hasError: boolean,
    placeholder?: string,
    defaultValue: string,
    type: 'textarea' | 'text' | 'number',
    touchField: (key: string, value: string) => void,
    disabled?: boolean
}

const RecipeFormInput = memo(({type, label, name, hasError, defaultValue, placeholder, touchField, disabled}: Props) => {

    const registerTouch = useCallback((v: string) => touchField('general', v), [touchField]);

    return <div className="form-group">
        <div className="label-row">
            <label htmlFor={name}>{label}</label>
            <p className="form-text text-danger">{hasError && `${label} is required`}</p>
        </div>
        <FormItem type={type} placeholder={placeholder} name={name} hasError={hasError} defaultValue={defaultValue} registerTouch={registerTouch} disabled={disabled} />
    </div>
});

export default RecipeFormInput;