import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const COOKIE_CONFIG_PROD : Partial<ResponseCookie> = {
    maxAge: 60 * 60, 
    httpOnly: true, 
    secure: true, 
    sameSite: 'strict'
};
export const COOKIE_CONFIG_DEV : Partial<ResponseCookie> = {
    maxAge: 60 * 60, 
    httpOnly: true, 
    sameSite: 'strict'
}