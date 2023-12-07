'use client';
import { useState } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import Link from 'next/link';
import { CONFIRMATION, EMAIL, PASSWORD } from '@/helpers/types'; 
import { authenticate } from '@/helpers/auth-actions';
import { isValidEmail } from '@/helpers/client-helpers';
import { useStoreDispatch } from '@/store/store';
import SubmitButton from '../ui/SubmitButton/SubmitButton';

type AuthFormError = {field: string, message: string};
type AuthFormFeedback = {ok: true, email: string, password: string} | {ok: false, field: string, message: string};

export default function SignForm({isSignUpMode}: {isSignUpMode: boolean}) {
    const [ validationError, setValidationError] = useState<AuthFormError|null>(null);
    const [ submitError, setSubmitError ] = useState('');
    const dispatch = useStoreDispatch();

    const hasError = (field: string) => {
        return validationError && validationError.field === field;
    } 
    
    const getInputClass = (field: string) => {
        return `form-control ${hasError(field) ? 'invalid' : ''}`;
    }
    
    const getFieldError = (field: string) => {
        return hasError(field) ? validationError!.message : '';
    }

    const validateThenAction = async (formData: FormData) => {
        const validation = validateForm(formData, isSignUpMode);

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

    const clearError = (field: string) => {
        if (hasError(field))
            setValidationError(null);
    };

    const clearErrors = () => {
        setSubmitError('');
        setValidationError(null);
    }

    return (<LazyMotion features={domAnimation}>
        <m.div initial={{opacity: 0, y: '50%'}} animate={{opacity: 1, y: 0}} className="row">
            <div className="col-xs-12 col-md-6 m-auto">
                <h3>Sign {isSignUpMode? 'up' : 'in'}</h3>
                <form action={validateThenAction} onFocus={clearErrors} autoComplete='off'>
                    <p className="text-danger form-text">{submitError}</p>
                    <div className="form-group mb-2">
                        <div className='label-row'>
                            <label htmlFor={EMAIL}>Email</label>
                            <p className="text-danger form-text">{getFieldError(EMAIL)}</p>
                        </div>
                        <input type="text" name={EMAIL} id={EMAIL}
                            className={getInputClass(EMAIL)}
                            onFocus={() => clearError(EMAIL)}
                            />
                    </div>
                    <div className="form-group mb-2">
                        <div className='label-row'>
                            <label htmlFor={PASSWORD}>Password</label>
                            <p className="text-danger form-text">{getFieldError(PASSWORD)}</p>
                        </div>
                        <input type="password" name={PASSWORD} id={PASSWORD}
                            className={getInputClass(PASSWORD)} 
                            onFocus={() => clearError(PASSWORD)}
                            />

                    </div>
                    { isSignUpMode && <div className="form-group mb-2">
                        <div className='label-row'>
                            <label htmlFor={CONFIRMATION}>Confirm password</label>
                            <p className="text-danger form-text">{getFieldError(CONFIRMATION)}</p>
                        </div>
                        <input type="password" name={CONFIRMATION} id={CONFIRMATION}
                            className={getInputClass(CONFIRMATION)} 
                            onFocus={() => clearError(CONFIRMATION)}
                            />
                    </div>}
                    <div className="row align-items-center justify-content-between g-1 mt-3">
                        <div className='col-5'>
                            <SubmitButton className="btn btn-success w-100">Sign {isSignUpMode ? 'up' : 'in'}</SubmitButton>
                        </div>
                        <Link className="btn btn-outline-success col-5" type="button" href={isSignUpMode ? '/auth/login' : '/auth/signup'}>
                            Go to sign {isSignUpMode ? 'in' : 'up'}
                        </Link>
                    </div>
                </form>      
            </div>
        </m.div>
    </LazyMotion> )
}

function validateForm(formData: FormData, isSignUpMode: boolean) : AuthFormFeedback {
    const email = formData.get(EMAIL)?.valueOf().toString().trim() || '';
    const password = formData.get(PASSWORD)?.valueOf().toString().trim() || '';

    if (!isValidEmail(email)) 
        return {ok: false, field: EMAIL, message: 'Invalid email'};

    if (isSignUpMode) {
        if (password.length < 6) 
            return {ok: false,  field: PASSWORD, message: 'Password is too short'};
    
        const confirmation = formData.get(CONFIRMATION)?.valueOf().toString().trim();
        
        if (password !== confirmation) 
            return {ok: false,  field: CONFIRMATION, message: 'Password and confirmation do not match'};
    }
    else {
        if (password.length === 0) 
            return {ok: false, field: PASSWORD, message: 'Password is empty'};
    }

    return {ok: true, email, password};
}