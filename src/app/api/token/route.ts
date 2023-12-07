import { verifyToken } from "@/helpers/server-helpers";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const userId = verifyToken(cookies(), '/api/token');

    if (userId)
        return new Response(null, {status: 200});
    
    return new Response(null, {status: 401});
}