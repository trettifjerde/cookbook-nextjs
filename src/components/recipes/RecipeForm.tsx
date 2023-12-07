'use client';
import { useEffect, useRef } from "react";
import { redirect, useRouter } from "next/navigation";
import { useStoreDispatch } from "@/store/store";
import { recipesActions } from "@/store/recipes";
import { statusCodeToMessage } from "@/helpers/client-helpers";
import { sendRecipe } from "@/helpers/recipe-actions";
import useErrors from "@/helpers/useErrors";
import { recipeErrorsInit, validateRecipe } from "@/helpers/forms";
import { FormRecipe, RECIPE_DESC, RECIPE_IMAGE_FILE, RECIPE_NAME } from "@/helpers/types";
import RecipeFormInput from "./formComponents/RecipeFormInput";
import RecipeFormSteps from "./formComponents/RecipeFormSteps";
import RecipeFormIngredients from "./formComponents/RecipeFormIngredients";
import SubmitButton from "../ui/SubmitButton/SubmitButton";
import RecipeFormImage from "./formComponents/RecipeFormImage";
import { useFormState } from "react-dom";

export default function RecipeForm({recipe, id}: {recipe: FormRecipe, id?: string}) {
    console.log('Recipe form');
    const dispatch = useStoreDispatch();
    const router = useRouter();

    const contTop = useRef<HTMLDivElement>(null);
    const [formState, formAction] = useFormState(sendRecipe, {id: id || '', status: 0});
    const {errors, hasErrors, setErrors, touchField} = useErrors(recipeErrorsInit);

    const handleSubmit = (formData: FormData) => {
        if (contTop.current) {
            const {errors: validationErrors} = validateRecipe(formData);

            if (validationErrors) {
                setErrors(validationErrors);
                contTop.current.scrollIntoView({behavior: 'smooth'});
                return;
            }

            formAction(formData);
        }
    };

    useEffect(() => {
        switch(formState.status) {
            case 200:
                const instruction = formState.instruction;
                let redirectId: string;

                switch (instruction.command) {
                    case 'add':
                    case 'update':
                        redirectId = instruction.preview.id;
                        const preview = instruction.preview;
                        const updPreviews = id ? recipesActions.editRecipe : recipesActions.addRecipe;
                        dispatch(updPreviews(preview));
                        break;
                    default:
                        redirectId = instruction.id;
                }

                redirect(`/recipes/${redirectId}`);

            default:
                contTop.current?.scrollIntoView({behavior: 'smooth'});
                break;
        }
    }, [formState, contTop])

    return <form className="recipe-form slideUp" action={handleSubmit} autoComplete="off">
        <div className="label-row" ref={contTop}>
            <h3>{ id ? 'Edit recipe' : 'Add recipe'}</h3> 
            <p className="form-text text-danger">{(hasErrors && 'Form contains errors') || statusCodeToMessage(formState.status)}</p>
        </div>     
        <RecipeFormInput type="text" name={RECIPE_NAME} label="Title" defaultValue={recipe.title} 
            hasError={errors.general.has(RECIPE_NAME)} touchField={touchField}/>     
        <hr/>
        <RecipeFormInput type="textarea" name={RECIPE_DESC} label="Description" defaultValue={recipe.description} 
            hasError={errors.general.has(RECIPE_DESC)} touchField={touchField}/> 
        <hr/>
        <RecipeFormImage defaultValue={recipe.imagePath} hasError={errors.general.has(RECIPE_IMAGE_FILE)} touchField={touchField}/>
        <hr/>
        <RecipeFormIngredients ingredients={recipe.ingredients} errors={errors.ingredients} touchField={touchField}/>
        <hr/>
        <RecipeFormSteps steps={recipe.steps} errors={errors.steps} touchField={touchField} />
        <hr/>
        <div className="row align-items-center justify-content-between g-0">
            <div className="col-5">
                <SubmitButton className="btn btn-success w-100">Submit</SubmitButton>
            </div>
            <button className="btn btn-outline-success col-5" type="button" onClick={() => router.back()}>Cancel</button>
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