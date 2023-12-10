'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { authenticate } from '@/helpers/auth-actions';
import SubmitButton from '../ui/SubmitButton/SubmitButton';
import { LinkButton } from '../ui/elements/buttons';
import { AuthFormError, CONFIRMATION, EMAIL, PASSWORD, validateAuthForm } from '@/helpers/form-validators';
import { Input } from '../ui/elements/forms';

export default function SignForm({isSignUpMode}: {isSignUpMode: boolean}) {
    console.log('Auth form');
    const [ validationError, setValidationError] = useState<AuthFormError|null>(null);
    const [ submitError, setSubmitError ] = useState('');

    const fields = isSignUpMode ? [EMAIL, PASSWORD, CONFIRMATION] : [EMAIL, PASSWORD];

    const hasError = (field: string) => validationError && validationError.field === field;
    
    const getInputClass = (field: string) => `w-full ${hasError(field) ? 'border-red' : ''}`;
    
    const getFieldError = (field: string) => hasError(field) ? validationError!.message : '';

    const clearError = (field: string) => {
        if (hasError(field))
            setValidationError(null);
    };

    const clearErrors = () => {
        setSubmitError('');
        setValidationError(null);
    }

    const validateThenAction = async (formData: FormData) => {
        const validation = validateAuthForm(formData, isSignUpMode);

        if (!validation.ok) {
            const {field, message} = validation;
            setValidationError({field, message});
            return;
        }

        const {email, password} = validation;

        const res = await authenticate({email, password}, isSignUpMode);

        switch(res.status) {           
            case 400:
                setSubmitError(res.error);
                break;

            default: 
                setSubmitError('Database error');
        }
    }

    return <motion.div initial={{opacity: 0, y: '50%'}} animate={{opacity: 1, y: 0}}
        className='py-8 w-full max-w-lg m-auto'>
            <h3 className='text-2xl font-medium mb-4'>Sign {isSignUpMode? 'up' : 'in'}</h3>
            <form action={validateThenAction} onFocus={clearErrors} autoComplete='off'>
                <p className="text-red text-xs min-h-error-msg my-1">{submitError}</p>

                { fields.map(field => <div className="mb-4" key={field.name}>
                    <div className='flex flex-row justify-between items-center'>
                        <label htmlFor={field.name}>{field.label}</label>
                        <p className="text-red text-xs">{getFieldError(field.name)}</p>
                    </div>
                    <Input type={field.type} name={field.name} id={field.name}
                        className={getInputClass(field.name)}
                        onFocus={() => clearError(field.name)}
                        />
                </div>) }

                <div className="flex flex-row flex-wrap gap-4">
                    <div className='col-5'>
                        <SubmitButton>Sign {isSignUpMode ? 'up' : 'in'}</SubmitButton>
                    </div>
                    <LinkButton color='greenOutline' url={isSignUpMode ? '/auth/login' : '/auth/signup'}>
                        Go to sign {isSignUpMode ? 'in' : 'up'}
                    </LinkButton>
                </div>

            </form>      
        </motion.div>
}