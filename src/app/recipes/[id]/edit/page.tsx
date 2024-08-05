import FormSkeleton from "@/components/recipes/form/FormSkeleton";
import RecipeEditFormPage from "@/components/recipes/RecipeEditFormPage";

import getUserId from "@/helpers/server/cachers/token";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function EditRecipePage({params}: {params: {id: string}}) {

    const userId = getUserId();
    if (!userId)
        redirect('/auth/login');
    
    return <Suspense fallback={<FormSkeleton />}>
        <RecipeEditFormPage id={params.id} />
    </Suspense>
};