'use client';
import { FormEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { generalActions } from '@/store/generalState';
import { useStoreDispatch } from '@/store/store';
import Link from 'next/link';
import { isValidEmail } from '@/helpers/utils';
import { AuthForm, AuthMode } from '@/helpers/types'; 
import { registerLogIn } from '@/store/complexActions';
import { useRouter } from 'next/navigation';
import { fetchAuth } from '@/helpers/authClient';
import { LazyMotion, domAnimation, m } from 'framer-motion';

export default function SignForm({mode}: {mode: AuthMode}) {

    const router = useRouter();
    const dispatch = useStoreDispatch();
    const isSignUpMode = mode === 'signup';

    const [errors, setErrors] = useState<{[key: string]: boolean}>({});

    const emailRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);
    const confRef = useRef<HTMLInputElement>(null);

    const validate = useCallback(() => {
        const form = {} as AuthForm;
        const errs: {[key: string]: boolean} = {};

        if (emailRef.current && passRef.current) {

            if (isValidEmail(emailRef.current.value.trim()))
                form.email = emailRef.current.value.trim();
            else 
                errs.email = true;

            if (passRef.current.value.trim().length > 5) 
                form.password = passRef.current.value.trim();
            else 
                errs.password = true;

            if (confRef.current) {
                if (confRef.current.value.trim() !== passRef.current.value.trim())
                    errs.confirmation = true;
            }
        }
        
        return {form, errs};
    }, [emailRef, passRef, confRef]);

    const onSubmitForm: FormEventHandler = useCallback(async(event) => {
        event.preventDefault();

        const {form, errs} = validate();

        if (Object.keys(errs).length !== 0) {
            setErrors(errs);
        }
        else {
            dispatch(generalActions.setSubmitting(true));

            const response = await fetchAuth(mode, form);

            if ('error' in response) {
                dispatch(generalActions.flashToast({text: response.error, isError: true}));
                return;
            }
            else {
                try {
                    const {user} = response;
                    dispatch(registerLogIn(user));
                    router.replace('/recipes');
                }
                catch(err) {
                    dispatch(generalActions.flashToast({text: 'An error has occurred', isError: true}))
                }
            }
        }
    }, [dispatch, validate, setErrors]);

    useEffect(() => {
        setErrors({});
    }, [isSignUpMode, setErrors]);

    return (<LazyMotion features={domAnimation}>
        <m.div initial={{opacity: 0, y: '50%'}} animate={{opacity: 1, y: 0}} className="row">
            <div className="col-xs-12 col-md-6 m-auto">
                <h3>Sign {isSignUpMode? 'up' : 'in'}</h3>
                <form onSubmit={onSubmitForm}>
                    <div className="form-group mb-2">
                        <div className='label-row'>
                            <label htmlFor="email">Email</label>
                            { 'email' in errors && <p className="text-danger form-text">Must be valid email.</p>}
                        </div>
                        <input ref={emailRef} type="text" className='form-control' name="email" />
                    </div>
                    <div className="form-group mb-2">
                        <div className='label-row'>
                            <label htmlFor="password">Password</label>
                            { 'password' in errors && <p className="text-danger form-text">
                                Must be at least 6 characters.
                            </p>}
                        </div>
                        <input ref={passRef} type="password" className='form-control' name="password" />

                    </div>
                    { isSignUpMode && <div className="form-group mb-2">
                        <div className='label-row'>
                            <label htmlFor="confirmation">Confirm password</label>
                            { 'confirmation' in errors && <p className="text-danger form-text">
                                Must match password.
                            </p>}
                        </div>
                        <input ref={confRef} type="password" className='form-control' name="confirmation" />
                    </div>}
                    <div className="row justify-content-between g-1 mt-3">
                        <button type="submit" className="btn btn-success col-md-5">
                            Sign {isSignUpMode ? 'up' : 'in'}
                        </button> 
                        <Link className="btn btn-outline-success col-md-5" type="button" href={isSignUpMode ? '/auth/login' : '/auth/signup'}>
                            Go to sign {isSignUpMode ? 'in' : 'up'}
                        </Link>
                    </div>
                </form>      
            </div>
        </m.div>
    </LazyMotion> )
}