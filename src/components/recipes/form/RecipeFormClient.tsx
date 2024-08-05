'use client';

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useStoreDispatch } from "@/store/store";
import { generalActions } from "@/store/general";

import { sendRecipe } from "@/helpers/server/server-actions/recipe-actions";
import useErrors from "@/helpers/client/hooks/useErrors";
import { statusCodeToMessage } from "@/helpers/client/client-helpers";
import { recipeErrorsInit, validateRecipe } from "@/helpers/client/validators/forms";
import { ErrorCodes, FormRecipe, RECIPE_DESC, RECIPE_IMAGE_FILE, RECIPE_NAME } from "@/helpers/types";

import RecipeFormInput from "./RecipeFormInput";
import RecipeFormSteps from "./RecipeFormSteps";
import RecipeFormIngredients from "./RecipeFormIngredients";
import SubmitButton from "../../ui/elements/SubmitButton";
import RecipeFormImage from "./RecipeFormImage";
import { ErrorMessage } from "../../ui/elements/misc";
import { Button } from "../../ui/elements/buttons";
import RecipeFormGroup from "./RecipeFormGroup";

export default function RecipeFormClient({recipe, id}: {recipe: FormRecipe, id?: string}) {

    const dispatch = useStoreDispatch();
    const router = useRouter();
    const contTop = useRef<HTMLDivElement>(null);
    const {errors, hasErrors, setErrors, touchField} = useErrors(recipeErrorsInit);
    const [errorCode, setErrorCode] = useState<ErrorCodes | 0>(0);

    const handleSubmit = async(formData: FormData) => {
        const {data, errors: validationErrors} = validateRecipe(formData);
        
        if (validationErrors) {
            setErrors(validationErrors);
            contTop.current?.scrollIntoView({behavior: "smooth"});
            return;
        }
        
        if (data.imageFile)
            dispatch(generalActions.setWarning('Recipes with images might take some time to upload'));
        
        const code = await sendRecipe({formData, id});

        setErrorCode(code);
    }

    return <form className="animate-slideUp py-4 px-2" action={handleSubmit} autoComplete="off">

        <div className="flex flex-row items-center justify-between gap-2 mb-8" ref={contTop}>
            <h3 className="text-3xl font-medium">{ id ? 'Edit recipe' : 'Add recipe'}</h3> 
            <ErrorMessage text={(hasErrors && 'Form contains errors') || statusCodeToMessage(errorCode)} />
        </div>     

        <RecipeFormGroup label="Title" htmlFor={RECIPE_NAME} hasError={errors.general.has(RECIPE_NAME)} errorMsg="Cannot be empty">
            <RecipeFormInput type="text" name={RECIPE_NAME} defaultValue={recipe.title} 
                hasError={errors.general.has(RECIPE_NAME)} touchField={touchField}/> 
        </RecipeFormGroup>

        <RecipeFormGroup label="Description" htmlFor={RECIPE_DESC} hasError={errors.general.has(RECIPE_DESC)} errorMsg="Cannot be empty">
            <RecipeFormInput type="textarea" name={RECIPE_DESC} defaultValue={recipe.description} 
                hasError={errors.general.has(RECIPE_DESC)} touchField={touchField}/> 
        </RecipeFormGroup>

        <RecipeFormImage defaultValue={recipe.imagePath} hasError={errors.general.has(RECIPE_IMAGE_FILE)} />

        <RecipeFormIngredients ingredients={recipe.ingredients} errors={errors.ingredients} touchField={touchField}/>

        <RecipeFormSteps steps={recipe.steps} errors={errors.steps} touchField={touchField} />

        <div className="flex flex-row gap-2">
            <SubmitButton className="grow">Submit</SubmitButton>
            <Button color="greenOutline" type="button" className="grow" onClick={() => router.back()}>Cancel</Button>
        </div>
    </form> 
};

export const listVariants = {
    initial: {
        opacity: 0,
        y: -30,
        scale: 1
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1
    },
    exit: {
        scale: 0.7,
        opacity: 0,
        y: 0
    }
};