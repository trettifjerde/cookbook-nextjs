import { addRecipe, deleteRecipe, updateRecipe } from "@/helpers/dataServer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    if (!token) 
        return NextResponse.json({error: 'Your authentication token is invalid. Try logging out and in again.'});

    try {
        const {recipe, id} = await req.json();

        const dbResponse = !id ? addRecipe.bind(null, recipe, token) : 
            recipe ? updateRecipe.bind(null, recipe, id, token) : 
            deleteRecipe.bind(null, id, token);

        const res = await dbResponse();
        return NextResponse.json(res);
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({error: 'Bad request'});
    }
}