import { addIngredient, deleteIngredient, updateIngredient, updateIngredients } from "@/helpers/dataServer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const userId = req.cookies.get('id')?.value;
    if (token && userId) {
        const cookieUser = {token, id: userId};
        const {id, ing, ings} = await req.json();

        const dbResFn = ings ? updateIngredients.bind(null, ings, cookieUser) : !id ? addIngredient.bind(null, ing, cookieUser) : 
            ing ? updateIngredient.bind(null, id, ing, cookieUser) :
            deleteIngredient.bind(null, id, cookieUser);

        const res = await dbResFn();
        return NextResponse.json(res);

    }
    return NextResponse.json({error: 'Invalid token. Try logging out and in again.'});
}