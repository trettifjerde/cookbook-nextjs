import { ChangeEventHandler, FocusEventHandler, forwardRef } from "react";

type InputProps = {
    type: 'number' | 'text' | 'password',
    name: string,
    id: string,
    placeholder?: string,
    className?: string,
    disabled?: boolean,
    invalid?: boolean,
    defaultValue?: string,
    onFocus?: FocusEventHandler
    onChange?: ChangeEventHandler
};
type TextareaProps = {
    name: string,
    id: string,
    className?: string,
    disabled?: boolean,
    invalid?: boolean,
    defaultValue?: string,
    onFocus?: FocusEventHandler
    onChange?: ChangeEventHandler
};

const classes = {
    base: 'w-full px-3 py-2 border border-solid border-gray-300 rounded-md transition outline-none focus:shadow-form-element read-only:bg-gray-100 disabled:bg-gray-100',
    input({className, invalid}: {className: string, invalid: boolean}) {
        return `${this.base} ${className} ${invalid ? 'border-red' : ''}`
    },
    textarea({className, invalid}: {className: string, invalid: boolean}) {
        return `${this.base} resize-y min-h-textarea ${className} ${invalid ? 'border-red' : ''}`
    },
    skeletonInput() {
        return `${this.base} mb-1 min-h-btn-square grow animate-flicker`
    },
    skeletonTextarea() {
        return `${this.base} mb-1 min-h-textarea grow animate-flicker`
    }
}

export const formSkeletonInput = classes.skeletonInput();
export const formSkeletonTextarea = classes.skeletonTextarea();

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    type, name, id,
    defaultValue='',
    className='', placeholder='', 
    disabled=false, invalid=false,
    onChange=() => {},
    onFocus=() => {}
}, ref) => {
    //console.log('input', name);
    return <input type={type} ref={ref} name={name} id={id} placeholder={placeholder} disabled={disabled}
        className={classes.input({className, invalid})} autoComplete="off"
        defaultValue={defaultValue} onChange={onChange} onFocus={onFocus}/>
})

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
    name, id,
    defaultValue='',
    className='', 
    disabled=false, invalid=false,
    onChange=() => {},
    onFocus=() => {}
}, ref) => {

    return <textarea ref={ref} name={name} id={id} disabled={disabled}
        className={classes.textarea({className, invalid})} autoComplete="off"
        defaultValue={defaultValue} onChange={onChange} onFocus={onFocus}/>
})