'use client';

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { redirect, useRouter } from "next/navigation";
import { useStoreDispatch } from "@/store/store";
import { recipesActions } from "@/store/recipes";
import { generalActions } from "@/store/general";
import { statusCodeToMessage } from "@/helpers/client-helpers";
import { recipeErrorsInit, validateRecipe } from "@/helpers/forms";
import { sendRecipe } from "@/helpers/server-actions/recipe-actions";
import useErrors from "@/helpers/hooks/useErrors";
import { Alert, FormRecipe, RECIPE_DESC, RECIPE_IMAGE_FILE, RECIPE_NAME, RecipeUpdaterCommand } from "@/helpers/types";
import RecipeFormInput from "./formComponents/RecipeFormInput";
import RecipeFormSteps from "./formComponents/RecipeFormSteps";
import RecipeFormIngredients from "./formComponents/RecipeFormIngredients";
import SubmitButton from "../ui/elements/SubmitButton";
import RecipeFormImage from "./formComponents/RecipeFormImage";
import { ErrorMessage } from "../ui/elements/misc";
import { Button } from "../ui/elements/buttons";
import RecipeFormGroup from "./formComponents/RecipeFormGroup";

export default function RecipeForm({recipe, id}: {recipe: FormRecipe, id?: string}) {

    const dispatch = useStoreDispatch();
    const router = useRouter();

    const contTop = useRef<HTMLDivElement>(null);
    const [formState, formAction] = useFormState(sendRecipe, {id: id || '', status: 0});
    const {errors, hasErrors, setErrors, touchField} = useErrors(recipeErrorsInit);

    const handleSubmit = (formData: FormData) => {
        if (contTop.current) {
            const {data, errors: validationErrors} = validateRecipe(formData);

            if (validationErrors) {
                setErrors(validationErrors);
                contTop.current.scrollIntoView({behavior: 'smooth'});
                return;
            }
            if (data.imageFile)
                dispatch(generalActions.setAlert('Recipes with images might take some time to upload'));
            formAction(formData);
        }
    };

    useEffect(() => {
        switch(formState.status) {
            case 200:
                const instruction = formState.instruction;
                let redirectId: string;

                switch (instruction.command) {
                    case RecipeUpdaterCommand.UpdateClient:
                        redirectId = instruction.preview.id;
                        dispatch((id ? recipesActions.editRecipe : recipesActions.addRecipe)(instruction.preview));
                        break;

                    case RecipeUpdaterCommand.Skip:
                        redirectId = instruction.id;
                        dispatch((id ? generalActions.editRecipe : generalActions.addRecipe)(instruction.title));
                        break;
                }

                redirect(`/recipes/${redirectId}`);

            default:
                contTop.current?.scrollIntoView({behavior: 'smooth'});
                break;
        }
    }, [formState, contTop])

    return <form className="animate-slideUp py-4 px-2" action={handleSubmit} autoComplete="off">

        <div className="flex flex-row items-center justify-between gap-2" ref={contTop}>
            <h3 className="text-3xl font-medium mb-8">{ id ? 'Edit recipe' : 'Add recipe'}</h3> 
            <ErrorMessage text={(hasErrors && 'Form contains errors') || statusCodeToMessage(formState.status)} />
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