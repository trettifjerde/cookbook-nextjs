import { memo, useEffect, useRef } from "react";

type Props = {
    placeholder?: string,
    step?: number,
    name: string,
    defaultValue: string,
    type: 'textarea' | 'text' | 'number',
    showError: boolean,
    className?: string,
    registerTouch: (value: string) => void
}

function FormItem({type, step, showError, placeholder, name, defaultValue, className, registerTouch}: Props) {
    const clName = `form-control ${className ? className : ''} ${showError ? 'invalid' : ''}`;

    let content : JSX.Element;

    const handleTouch = () => {
        if (showError)
            registerTouch(name);
    }

    useEffect(() => {}, [defaultValue]);

    switch (type) {
        case 'textarea':
            content = <textarea className={clName} id={name} name={name} 
                defaultValue={defaultValue} placeholder={placeholder ? placeholder : ''}
                onFocus={handleTouch}></textarea>;
            break;
        default:
            if (step)
                content = <input type={type} step={step} id={name} name={name} className={clName} defaultValue={defaultValue} 
                    placeholder={placeholder ? placeholder : ''} onFocus={handleTouch}/>

            else 
                content = <input type={type} id={name} name={name} className={clName} defaultValue={defaultValue} 
                    placeholder={placeholder ? placeholder : ''} onFocus={handleTouch}/>
    }

    return content;
}

export default memo(FormItem);