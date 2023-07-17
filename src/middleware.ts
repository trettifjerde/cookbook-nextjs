import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const cookies = request.cookies;
    if (!cookies.get('token') || !cookies.get('id')) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
}

export const config = {
    matcher: ['/recipes/new', '/recipes/:id/edit', '/list']
}