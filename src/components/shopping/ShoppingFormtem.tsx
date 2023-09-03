import { memo } from "react";
import FormItem from "../FormItem"

type Props = {
    defaultValue: string,
    name: string,
    showError: boolean,
    label: string,
    type: 'text' | 'number',
    registerTouch: (name: string) => void
}

function ShoppingListFormItem({showError, registerTouch, name, defaultValue, label, type}: Props) {
    return <>
        <label htmlFor={name}>{label}</label>
        <FormItem type={type} showError={showError} name={name} defaultValue={defaultValue} registerTouch={registerTouch} />
    </>
}

export default memo(ShoppingListFormItem);