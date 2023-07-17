import { AuthForm, AuthMode } from "./types";
import { makeError, makeUserInfo } from "./utils";

const signUpUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
const signInUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';

export async function authenticate(mode: AuthMode, form: AuthForm) {
    const url = (mode === 'signup' ? signUpUrl : signInUrl) + process.env.AUTH_KEY;
    
    return await fetch(url, {
        method: 'POST',
        body: JSON.stringify(form),
        headers: {
            'Content-Type': '/application/json'
        }
    })
    .then(r => r.json())
    .then(d => {
        if ('error' in d && d.error.code === 400) {
            throw new Error('Invalid email or password')
        }
        return makeUserInfo(d);
    })
    .catch(makeError)
}