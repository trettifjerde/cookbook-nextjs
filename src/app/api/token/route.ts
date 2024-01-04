import getUserId from "@/helpers/cachers/token";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const userId = getUserId();

    if (userId)
        return new Response(null, {status: 200});
    
    return new Response(null, {status: 401});
}