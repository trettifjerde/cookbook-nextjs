'use server'

import { AuthFormData, MongoUser } from "@/helpers/types";
import { Collection, ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { makeHash, makeToken, queryDB } from "./server-helpers";
import { redirect } from "next/navigation";

type SubmitResponse = {status: 200, id: string} | {status: 400, error: string} | {status: 500};
type AuthResponse = {ok: true, userId: string} | {ok: false, error: string};

export async function authenticate(form: AuthFormData, isSignUpMode: boolean): Promise<SubmitResponse> {

    const authenticationFn = isSignUpMode ? signUp : signIn
    
    const result = await queryDB('users', authenticationFn.bind(null, form));

    if (!result)
        return {status: 500};

    if (!result.ok) 
        return {status: 400, error: result.error };

    cookies().set('token', makeToken(result.userId), {
        maxAge: 60 * 60, 
        httpOnly: true, 
        secure: true, 
        sameSite: 'strict'
    });
    
    redirect('/recipes');
}

async function signUp(form: AuthFormData, col: Collection<MongoUser>) : Promise<AuthResponse> {
    const {email, password} = form;
    const exists = await col.findOne({email});

    if (exists) {
        return {ok: false, error: 'Email is already taken'};
    }

    const hash = makeHash(password);
    const res = await col.insertOne({email, hash, _id: new ObjectId()});

    return {ok: true, userId: res.insertedId.toString()};
}

async function signIn(form: AuthFormData, col: Collection<MongoUser>) : Promise<AuthResponse> {
    const {email, password} = form;
    const exists = await col.findOne({email});

    if (!exists)
        return {ok: false, error: 'Invalid email or password'}

    const hash = makeHash(password);

    if (hash !== exists.hash)
        return {ok: false, error: 'Invalid email or password'}

    return {ok: true, userId: exists._id.toString()}
}

export async function logOut() {
    cookies().delete('token');
    redirect('/recipes');
}