import { memo } from "react";
import FormItem from "../ui/FormItem"

type Props = {
    defaultValue: string,
    name: string,
    hasError: boolean,
    label: string,
    type: 'text' | 'number',
    registerTouch: (name: string) => void
}

function ShoppingListFormItem({hasError, registerTouch, name, defaultValue, label, type}: Props) {
    return <>
        <label htmlFor={name}>{label}</label>
        <FormItem type={type} hasError={hasError} name={name} defaultValue={defaultValue} registerTouch={registerTouch} />
    </>
}

export default memo(ShoppingListFormItem);