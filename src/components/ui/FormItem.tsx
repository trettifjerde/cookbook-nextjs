import { memo } from "react";

type Props = {
    placeholder?: string,
    name: string,
    defaultValue: string,
    type: 'textarea' | 'text' | 'number',
    hasError: boolean,
    className?: string,
    registerTouch: (value: string) => void,
    disabled?: boolean
}

const FormItem = memo(({type, hasError, placeholder, name, defaultValue, className, registerTouch, disabled}: Props) => {
    const clName = `form-control ${className ? className : ''} ${hasError ? 'invalid' : ''}`;

    let content : JSX.Element;

    const handleTouch = () => {
        if (hasError)
            registerTouch(name);
    }

    switch (type) {
        case 'textarea':
            content = <textarea className={clName} id={name} name={name}
                defaultValue={defaultValue} placeholder={placeholder ? placeholder : ''}
                onFocus={handleTouch} disabled={disabled}></textarea>;
            break;
        default:
            if (type === 'number')
                content = <input type={type} step={0.01} id={name} name={name} className={clName} defaultValue={defaultValue} 
                    placeholder={placeholder ? placeholder : ''} onFocus={handleTouch} disabled={disabled}/>

            else 
                content = <input type={type} id={name} name={name} className={clName} defaultValue={defaultValue} 
                    placeholder={placeholder ? placeholder : ''} onFocus={handleTouch} disabled={disabled}/>
    }

    return content;
})

export default FormItem;