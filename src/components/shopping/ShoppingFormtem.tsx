import { useCallback } from "react";
import { Input } from "../ui/elements/forms";

type Props = {
    defaultValue: string,
    name: string,
    hasError: boolean,
    label: string,
    type: 'text' | 'number',
    className: string,
    registerTouch: (name: string) => void
}

const ShoppingListFormItem = ({className, hasError, registerTouch, name, defaultValue, label, type}: Props) => {

    const touchField = useCallback(() => registerTouch(name), [name, registerTouch]);
    
    return <div className={className}>
        <label className="block font-medium" htmlFor={name}>{label}</label>
        <Input type={type} invalid={hasError} name={name} id={name} defaultValue={defaultValue} onFocus={touchField} />
    </div>
}

export default ShoppingListFormItem;