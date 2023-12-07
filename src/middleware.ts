import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const token = cookies().get('token')?.value || '';

    const h : HeadersInit = {
        'Cookie': `token=${token}`
    };
    
    const pathname = req.nextUrl.pathname;
    console.log('MIDDLEWARE:', pathname);
    const isAuthed = await fetch(
        new URL('/api/token', req.url), 
        {method: 'GET', headers: new Headers(h)
    })
        .then(res => res.ok)
        .catch(error => {
            console.log('Middleware got fetch error checking token', error);
            return false;
    });

    if (isAuthed) {
        if (pathname.startsWith('/auth')) 
            return NextResponse.redirect(new URL('/recipes', req.url));
        else
            return NextResponse.next();
    }
    else {
        if (pathname.startsWith('/auth')) 
            return NextResponse.next();
        else
            return NextResponse.redirect(new URL('/auth/login', req.url));
    }
}

export const config = {
    matcher: ['/auth/:mode*', '/recipes/:id/edit', '/recipes/new', '/list']
}