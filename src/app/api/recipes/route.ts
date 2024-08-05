import { readInitPreviews } from "@/helpers/server/db/queries";
import { InitPreviewsBatch } from "@/helpers/types";

export const dynamic = 'force-dynamic';

export async function GET() {
    console.log(`API/recipes/`);

    const {ok, result} = await readInitPreviews(); 

    if (!ok) 
        return new Response(null, {status: 500});

    return Response.json({
        previews: result,
        id: new Date().getTime()
    } as InitPreviewsBatch);
}