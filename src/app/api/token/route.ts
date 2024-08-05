import getUserId from "@/helpers/server/cachers/token";

export async function GET() {
    console.log('/API/token');
    const userId = getUserId();

    if (userId)
        return new Response(null, {status: 200});
    
    return new Response(null, {status: 401});
}