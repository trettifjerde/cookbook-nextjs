'use server'

import { Collection, ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthFormData, MongoUser } from "@/helpers/types";
import { makeHash, makeToken } from "../actions";
import { COOKIE_CONFIG, USERS_COLLECTION } from "@/helpers/config";
import { dbCol } from "../db/controller";

type SubmitResponse = { status: 200 } | { status: 400, error: string } | { status: 500 };
type AuthResponse = { ok: true, userId: string } | { ok: false, error: string };

export async function authenticate(form: AuthFormData, isSignUpMode: boolean): Promise<SubmitResponse> {

    const authFn = isSignUpMode ? signUp : signIn;

    const { ok, result } = await dbCol(USERS_COLLECTION, (col: Collection<MongoUser>) => authFn(form, col));

    if (!ok || !result)
        return { status: 500 };

    if (!result.ok)
        return { status: 400, error: result.error };

    cookies().set('token', makeToken(result.userId), COOKIE_CONFIG);
    redirect('/recipes');
}

async function signUp(form: AuthFormData, col: Collection<MongoUser>): Promise<AuthResponse> {
    const { email, password } = form;
    const exists = await col.findOne({ email });

    if (exists) {
        return { ok: false, error: 'Email is already taken' };
    }

    const hash = makeHash(password);
    const res = await col.insertOne({ email, hash, _id: new ObjectId() });

    return { ok: true, userId: res.insertedId.toString() };
}

async function signIn(form: AuthFormData, col: Collection<MongoUser>): Promise<AuthResponse> {
    const { email, password } = form;
    const exists = await col.findOne({ email });

    if (!exists)
        return { ok: false, error: 'Invalid email or password' }

    const hash = makeHash(password);

    if (hash !== exists.hash)
        return { ok: false, error: 'Invalid email or password' }

    return { ok: true, userId: exists._id.toString() }
}

export async function logOut() {
    cookies().delete('token');
    redirect('/recipes');
}