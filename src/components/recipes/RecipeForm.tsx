'use client';
import { useState, useRef, FormEventHandler } from "react";
import { FirebaseRecipe, FormRecipe } from "@/helpers/types";
import { useRouter } from "next/navigation";
import { useStoreDispatch } from "@/store/store";
import { recipesActions } from "@/store/recipesState";
import { generalActions } from "@/store/generalState";
import { fetchData } from "@/helpers/utils";
import RecipePageWrapper from "./RecipePageWrapper";
import useRedirectOnLogout from "@/helpers/useRedirectOnLogout";
import RecipeFormInput from "./formComponents/RecipeFormInput";
import { RECIPE_DESC, RECIPE_IMAGE, RECIPE_NAME, recipeErrorsInit, validateRecipe } from "@/helpers/forms";
import RecipeFormSteps from "./formComponents/RecipeFormSteps";
import RecipeFormIngredients from "./formComponents/RecipeFormIngredients";
import useErrors from "@/helpers/useErrors";

export default function RecipeForm({recipe}: {recipe: FormRecipe}) {
    useRedirectOnLogout();
    const dispatch = useStoreDispatch();
    const router = useRouter();
    const {errors, setErrors, clearErrors, touchField} = useErrors(recipeErrorsInit);
    const contTop = useRef<HTMLDivElement>(null);
    const recipeId = recipe.id;

    const submitForm = async (data: FirebaseRecipe) => {
        dispatch(generalActions.setSubmitting(true));

        const res = await fetchData('/api/recipes', 'POST', {
            recipe: data, 
            id: recipeId,
        });

        if ('error' in res) {
            dispatch(generalActions.flashToast({text: res.error, isError: true}));
        }
        else if ('id' in res) {
            const newRecipe = {...data, id: res.id};
            dispatch(recipeId ? recipesActions.updateRecipe(newRecipe) : recipesActions.addRecipe(newRecipe));
            dispatch(generalActions.flashToast({text: recipeId ? 'Recipe updated' : 'Recipe added', isError: false}));
            router.push(`/recipes/${res.id}`);
        }
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()

        const formData = new FormData(e.target as HTMLFormElement);
        const {data, errors: errs} = validateRecipe(formData);

        if (errs) {
            setErrors(errs);
            contTop.current?.scrollIntoView({behavior: 'smooth'});
        }
        else {
            submitForm(data);
        }
    };

    const cancelSubmit = () => router.back();

    return <RecipePageWrapper>
        <div className="label-row" ref={contTop}>
            <h3>{ recipe.id ? 'Edit recipe' : 'Add recipe'}</h3> 
            {Object.values(errors).some(s => s.size !== 0) && <p className="form-text text-danger">Form contains errors</p>}
        </div>
        <div className="r">        
            <form className="recipe-form" onSubmit={handleSubmit}>
                <RecipeFormInput type="text" name={RECIPE_NAME} label="Name" defaultValue={recipe.name} 
                    showError={errors.general.has(RECIPE_NAME)} touchField={touchField}/>     
                <hr/>
                <RecipeFormInput type="textarea" name={RECIPE_DESC} label="Description" defaultValue={recipe.description} 
                    showError={errors.general.has(RECIPE_DESC)} touchField={touchField}/> 
                <hr/>
                <RecipeFormInput type="text" name={RECIPE_IMAGE} label="Image URL" defaultValue={recipe.imagePath} 
                    showError={errors.general.has(RECIPE_IMAGE)} touchField={touchField} />
                <hr/>
                <RecipeFormIngredients ingredients={recipe.ingredients} errors={errors.ingredients} touchField={touchField}/>
                <hr/>
                <RecipeFormSteps steps={recipe.steps} errors={errors.steps} touchField={touchField} />
                <hr/>
                <div className="row justify-content-between g-0">
                    <button className="btn btn-success col-5" type="submit">Submit</button>
                    <button className="btn btn-outline-success col-5" type="button" onClick={cancelSubmit}>Cancel</button>
                </div>
            </form>
        </div> 
    </RecipePageWrapper>
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