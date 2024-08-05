import { NextRequest } from 'next/server'; 
import { readInitPreviews } from '@/helpers/server/db/queries';

export async function GET(req: NextRequest) {
    
    const searchParams = req.nextUrl.searchParams;
    const lastId = searchParams.get('lastId');

    console.log(`API/more, lastId: ${lastId || 'null'}`);

    const {ok, result} = await readInitPreviews(lastId, true);

    if (!ok) 
        return new Response(null, { status: 500 });

    if (result) {
        return Response.json(result);
    }
    
    return Response.json([]);
}