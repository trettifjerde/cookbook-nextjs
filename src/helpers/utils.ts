import { FirebaseToken, Method, User } from "./types";

export function isValidEmail(value: string) {
    return /^\w+([.\-!#$%&'*+\-/=?^_`{|}~]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(value)
}

export async function fetchData(url: string, method: 'POST' | 'PATCH' | 'DELETE', data?: any) {
    return fetch(url, {
        method,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(r => r.json())
    .catch(makeError);
}

export const makeError = (error: Error) => {
    return {error: error.message};
}

export const makeRecipeUrl = (path?: string) => {
    return `https://academind34-default-rtdb.europe-west1.firebasedatabase.app/recipes${path ? '/' + path : ''}.json`;
}

export function makeUserInfo(res: FirebaseToken) {
    const expiresIn = +res.expiresIn;
    const expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);
    const user: User = {email: res.email, id: res.localId, token: res.idToken, expirationDate: expirationDate.toISOString()};
    return {info: {user, expiresIn}};
}

export const makeIngredsUrl = (id: string, path?: string) => {
    return `https://academind34-default-rtdb.europe-west1.firebasedatabase.app/list/${id}${path ? '/' + path : ''}.json`;
}

const addAuth = (url: string, token: string) => {
    return url + '?auth=' + token;
}

export async function privateFetch(url: string, token: string, method: Method, body: any, errorMessage: string, callback: (d: any) => any) {
    return fetch(addAuth(url, token), {
        method: method,
        body: body? JSON.stringify(body) : null,
        headers: {'Content-Type': 'application/json'}
        })
        .then(res => {
            if (res.status === 401) throw Error('Your authentication token is invalid. Try logging out and in again.', {cause: res.status});
            else if (!res.ok) throw new Error(errorMessage, {cause: res.status});
            else return res.json()
        })
        .then(data => {
            if (callback) return callback(data);
            else return data;
        })
        .catch(makeError);
}