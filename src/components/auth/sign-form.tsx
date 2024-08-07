'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SubmitButton from '../ui/elements/SubmitButton';
import { LinkButton } from '../ui/elements/buttons';
import { AuthFormError, CONFIRMATION, EMAIL, PASSWORD, validateAuthForm } from '@/helpers/client/validators/form-validators';
import { Input } from '../ui/elements/forms';
import { ErrorMessage } from '../ui/elements/misc';
import { authenticate } from '@/helpers/server/server-actions/auth-actions';

export default function SignForm({isSignUpMode}: {isSignUpMode: boolean}) {

    const [ validationError, setValidationError] = useState<AuthFormError|null>(null);
    const [ submitError, setSubmitError ] = useState('');

    const fields = isSignUpMode ? [EMAIL, PASSWORD, CONFIRMATION] : [EMAIL, PASSWORD];

    const hasError = (field: string) => validationError && validationError.field === field;
    const getInputClass = (field: string) => hasError(field) ? 'border-red' : '';
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

            case 500:
                setSubmitError('Database error');
                break;

            default: 
                setSubmitError('Network error');
        }
    }

    return <AnimatePresence>
        <motion.div initial={{opacity: 0, x: isSignUpMode ? '10%' : '-10%'}} animate={{opacity: 1, x: 0}}
            transition={{
                type: 'tween', 
                duration: 0.3 
            }}
            className='py-16 px-2 w-full h-full overflow-auto max-w-lg m-auto'>

            <h3 className='text-2xl font-medium mb-4'>Sign {isSignUpMode? 'up' : 'in'}</h3>
            <form action={validateThenAction} onFocus={clearErrors} autoComplete='off'>

                <ErrorMessage text={submitError} />

                { fields.map(field => <div className="mb-4" key={field.name}>
                    <div className='flex flex-row justify-between items-center'>
                        <label htmlFor={field.name}>{field.label}</label>
                        <ErrorMessage text={getFieldError(field.name)} />
                    </div>
                    <Input type={field.type} name={field.name} id={field.name}
                        className={getInputClass(field.name)}
                        onFocus={() => clearError(field.name)}
                        />
                </div>) }

                <div className="flex flex-row justify-evenly flex-wrap gap-4 *:min-w-32">
                    <SubmitButton>Sign {isSignUpMode ? 'up' : 'in'}</SubmitButton>
                    <LinkButton color='greenOutline' url={isSignUpMode ? '/auth/login' : '/auth/signup'}>
                        Go to sign {isSignUpMode ? 'in' : 'up'}
                    </LinkButton>
                </div>

            </form>      
        </motion.div>
    </AnimatePresence>
}