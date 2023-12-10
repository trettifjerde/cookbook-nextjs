import { ChangeEventHandler, FocusEventHandler, forwardRef } from "react";

type InputProps = {
    type: 'number' | 'text' | 'password',
    name: string,
    id: string,
    placeholder?: string,
    className?: string,
    onFocus?: FocusEventHandler
    onChange?: ChangeEventHandler
};
type TextareaProps = {};

const classes = {
    base: 'px-3 py-2 border border-solid border-gray-300 rounded-md transition outline-none focus:shadow-form-element',
    input(className: string) {
        return `${this.base} ${className}`
    }
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    type, className='', placeholder='', name, id,
    onChange=() => {},
    onFocus=()=>{}
}, ref) => {
    return <input type={type} ref={ref} name={name} id={id}
    className={classes.input(className)} autoComplete="off"
        onChange={onChange} onFocus={onFocus} placeholder={placeholder} />
})

export function Textarea() {

}