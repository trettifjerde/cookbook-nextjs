type FieldInfo = {label: string, name: string, type: 'password' | 'text'};
export const EMAIL : FieldInfo = {label: 'Email', name: 'email', type: 'text'};
export const PASSWORD : FieldInfo = {label: 'Password', name: 'password', type: 'password'};
export const CONFIRMATION : FieldInfo = {label: 'Confirmation', name: 'confirmation', type: 'password'};

export function validateAuthForm(formData: FormData, isSignUpMode: boolean) : AuthFormFeedback {
    const email = formData.get(EMAIL.name)?.valueOf().toString().trim() || '';
    const password = formData.get(PASSWORD.name)?.valueOf().toString().trim() || '';

    if (!isValidEmail(email)) 
        return {ok: false, field: EMAIL.name, message: 'Invalid email'};

    if (isSignUpMode) {
        if (password.length < 6) 
            return {ok: false,  field: PASSWORD.name, message: 'Password is too short'};
    
        const confirmation = formData.get(CONFIRMATION.name)?.valueOf().toString().trim();
        
        if (password !== confirmation) 
            return {ok: false,  field: CONFIRMATION.name, message: 'Password and confirmation do not match'};
    }
    else {
        if (password.length === 0) 
            return {ok: false, field: PASSWORD.name, message: 'Password is empty'};
    }

    return {ok: true, email, password};
}

export function isValidEmail(value: string) {
    return /^\w+([.\-!#$%&'*+\-/=?^_`{|}~]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(value)
}

export type AuthFormClean = { email: string, password: string };
export type AuthFormError = { field: string, message: string };
export type AuthFormFeedback = {ok: true} & AuthFormClean | {ok: false} & AuthFormError;