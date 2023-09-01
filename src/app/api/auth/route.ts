import { authenticate } from "@/helpers/authServer";
import { AuthForm, AuthMode } from "@/helpers/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {mode, form}: {mode: AuthMode, form: AuthForm} = await req.json();

    const res = await authenticate(mode, form);

    if ('info' in res) {
        const response = new NextResponse(JSON.stringify({user: res.info.user}));
        cookies().set({
            name: 'token',
            value: res.info.user.token,
            httpOnly: true,
            maxAge: res.info.expiresIn
        });
        cookies().set({
            name: 'id',
            value: res.info.user.id,
            httpOnly: true,
            maxAge: res.info.expiresIn
        })
        return response;
    }

    return NextResponse.json(res);
}

export async function DELETE() {
    const res = new NextResponse(JSON.stringify({ok: ''}));
    cookies().delete('token');
    cookies().delete('id');
    return res;
}