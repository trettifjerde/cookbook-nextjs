import { authenticate } from "@/helpers/authServer";
import { AuthForm, AuthMode } from "@/helpers/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {mode, form}: {mode: AuthMode, form: AuthForm} = await req.json();

    const res = await authenticate(mode, form);

    if ('info' in res) {
        const response = new Response(JSON.stringify({user: res.info.user}));
        const token = `token=${res.info.user.token}; HttpOnly; Secure; Max-Age=${res.info.expiresIn}; Path=/;`;
        const id = `id=${res.info.user.id}; HttpOnly; Secure; Max-Age=${res.info.expiresIn}; Path=/;`
        response.headers.append('Set-Cookie', token);
        response.headers.append('Set-Cookie', id);
        return response;
    }

    return NextResponse.json(res);
}

export async function DELETE() {
    const res = new NextResponse(JSON.stringify({ok: ''}));
    res.cookies.delete('token');
    res.cookies.delete('id');
    return res;
}