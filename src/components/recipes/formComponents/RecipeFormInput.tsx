import FormItem from "@/components/FormItem";
import { memo, useCallback } from "react";

type Props = {
    label: string,
    name: string,
    showError: boolean,
    defaultValue: string,
    type: 'textarea' | 'text' | 'number',
    touchField: (key: string, value: string) => void
}

function RecipeFormInput({type, label, name, showError, defaultValue, touchField}: Props) {

    const registerTouch = useCallback((v: string) => touchField('general', v), [touchField]);

    return <div className="form-group">
        <div className="label-row">
            <label htmlFor={name}>{label}</label>
            { showError && <p className="form-text text-danger">{label} is required</p>}
        </div>
        <FormItem type={type} name={name} showError={showError} defaultValue={defaultValue} registerTouch={registerTouch} />
    </div>
}

export default memo(RecipeFormInput);