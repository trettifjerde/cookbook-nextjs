import { castFormToAuthRequest } from "./casters";
import { AuthForm, AuthMode, User } from "./types";
import { fetchData } from "./utils";

export async function fetchAuth(mode: AuthMode, form: AuthForm) {
    return await fetchData('/api/auth', 'POST', {mode, form: castFormToAuthRequest(form)});
}

export function getToken() {
    const userInfo = localStorage.getItem('userData');

    if (!userInfo) {
        return null;
    }
    const user : User = JSON.parse(userInfo);

    if (new Date() > new Date(user.expirationDate)) {
        removeToken();
        return null;
    }

    return user;
}

export function setToken(user: User) {
    localStorage.setItem('userData', JSON.stringify(user));
}

export function removeToken() {
    localStorage.removeItem('userData');
}

export async function logOut() {
    return await fetchData('/api/auth', 'DELETE');
}
