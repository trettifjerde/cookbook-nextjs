import { useEffect, useState } from "react"

type Props = {
    label: string,
    name: string,
    errors: {[key: string]: string},
    defaultValue: string,
    type?: 'textarea'
}

export default function RecipeFormInput({type, label, name, errors, defaultValue}: Props) {
    const [isTouched, setIsTouched] = useState(false);

    const showError = errors[name] && !isTouched;
    const className = `form-control ${showError ? 'invalid' : ''}`;

    useEffect(() => {
        setIsTouched(false);
    }, [errors, setIsTouched]);

    return <div className="form-group">
        <div className="label-row">
            <label htmlFor={name}>{label}</label>
            { showError && <p className="form-text text-danger">{label} is required</p>}
        </div>
        {type &&  <textarea className={className} id={name} name={name} defaultValue={defaultValue}
            onFocus={() => setIsTouched(true)}></textarea>}
        {!type && <input type="text" id={name} name={name} className={className} defaultValue={defaultValue} 
            onFocus={() => setIsTouched(true)}/>
        }
    </div>
}