'use client';
import { useCallback, useState, useRef, FormEventHandler } from "react";
import { FirebaseIngredient, FirebaseRecipe, FormErrors, FormIngredient, FormRecipe } from "@/helpers/types";
import { useRouter } from "next/navigation";
import { useStoreDispatch } from "@/store/store";
import { recipesActions } from "@/store/recipesState";
import useListManager from "@/helpers/useListManger";
import { generalActions } from "@/store/generalState";
import { fetchData } from "@/helpers/utils";
import RecipePageWrapper from "./RecipePageWrapper";
import { AnimatePresence, motion } from "framer-motion";
import useRedirectOnLogout from "@/helpers/useRedirectOnLogout";
import RecipeFormInput from "./formComponents/RecipeFormInput";

const listVariants = {
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

export default function RecipeForm({recipe}: {recipe: FormRecipe}) {
    useRedirectOnLogout();
    const dispatch = useStoreDispatch();
    const router = useRouter();
    const {list: ings, addItem: addIng, removeItem: removeIng} = useListManager<FirebaseIngredient, FormIngredient>(recipe.ingredients, makeNewIng);
    const {list: steps, addItem: addStep, removeItem: removeStep, moveItem: moveStep} = useListManager<string, {id: string, step: string}>(recipe.steps, makeNewStep);
    const [errors, setErrors] = useState<FormErrors>({});
    const contTop = useRef<HTMLDivElement>(null);
    const recipeId = recipe.id;

    const submitForm = useCallback(async (data: FirebaseRecipe) => {
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
            dispatch(recipeId ? recipesActions.updateRecipe(newRecipe) : recipesActions.addRecipe(newRecipe))
            router.push(`/recipes/${res.id}`);
        }
    }, [recipeId, router, dispatch]);

    const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback((e) => {
        e.preventDefault()

        const formData = new FormData(e.target as HTMLFormElement);
        const errs = formErrors(formData);

        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            contTop.current?.scrollIntoView({behavior: 'smooth'});
        }
        else {
            const data = transformToRequestData(formData);
            submitForm(data);
        }
    }, [setErrors, submitForm]);


    const cancelSubmit = useCallback(() => router.back(), [router]);

    return <RecipePageWrapper>
        <div className="label-row" ref={contTop}>
            <h3>{ recipe.id ? 'Edit recipe' : 'Add recipe'}</h3> 
        </div>
        <div className="r">        
            <form className="recipe-form" onSubmit={handleSubmit}>
                <RecipeFormInput name="name" label="Name" defaultValue={recipe.name} errors={errors}/>     
                <hr/>
                <RecipeFormInput type="textarea" name="description" label="Description" defaultValue={recipe.description} errors={errors}/> 
                <hr/>
                <RecipeFormInput name="imagePath" label="Image URL" defaultValue={recipe.imagePath} errors={errors} />
                <hr/>
                <div className="form-group">
                    <div className="label-row">
                        <label>Ingredients</label>
                        { errors.ingredients  && <p className="form-text text-danger">
                            Ingredients are required
                        </p>}
                    </div>
                    <AnimatePresence mode="popLayout">
                        { ings.map(ing => (
                            <motion.div layout key={ing.id} 
                                variants={listVariants} exit="exit" initial="initial" animate="animate">
                                <div className="row row-cols-auto align-items-center g-2 flex-nowrap ingred-cont">
                                    <div className="col flex-shrink-1">
                                        <input type="number" className={`form-control ${errors[ing.id + '-amount'] ? 'invalid' : ''}`} defaultValue={ing.amount} name={`${ing.id}-amount`} placeholder="amount" />
                                    </div>
                                    <div className="col flex-shrink-1">
                                        <input type="text" className="form-control" defaultValue={ing.unit} name={`${ing.id}-unit`} placeholder="unit" />
                                    </div>
                                    <div className="col flex-grow-1">
                                        <input type="text" className={`form-control ${errors[ing.id + '-name'] ? 'invalid' : ''}`} defaultValue={ing.name} name={`${ing.id}-name`} placeholder="name" />
                                    </div>
                                    <div className="col flex-shrink-1">
                                        <button className="btn btn-outline-danger" type="button" onClick={removeIng.bind(null, ing.id)}>X</button>
                                    </div>            
                                </div>
                            </motion.div>
                        )) }
                        <motion.button layout key="ing-btn" type="button" className="btn btn-outline-success mt-2" onClick={addIng}>
                            Add new ingredient
                        </motion.button>
                    </AnimatePresence>  
                </div>
                <hr/>
                <div className="form-group">
                    <AnimatePresence mode="popLayout">
                        <motion.div layout key="h-d" className="label-row">
                            <motion.label layout key="h-l">Steps</motion.label>
                            { errors.steps && <motion.p layout key="h-e" className="form-text text-danger">
                                Steps cannot be empty or longer than 1000 characters each
                            </motion.p>}
                        </motion.div>
                        <motion.ol layout key="s-o" className="list-group list-group-flush steps">
                            { steps.map(step => <motion.li layout key={step.id} className="list-group-item row step"
                                variants={listVariants} initial="initial" animate="animate" exit="exit">
                                    <div className="col-auto step-num-n-del">
                                        <div className="btn order-btn"></div>
                                        <button className="btn btn-outline-danger" type="button" onClick={removeStep.bind(null, step.id)}>X</button>      
                                    </div>
                                    <div className="col-md-8 step-area">
                                        <textarea className={`form-control ${errors[step.id] ? 'invalid' : ''}`} name={step.id} defaultValue={step.step}></textarea>
                                    </div>
                                    <div className="col-auto step-move-btns">
                                        <button className="btn btn-outline-success" type="button" onClick={moveStep.bind(null, step.id, -1)}>🡅</button>
                                        <button className="btn btn-outline-success" type="button" onClick={moveStep.bind(null, step.id, 1)}>🡇</button>      
                                    </div>
                                </motion.li>)} 
                        </motion.ol>
                        <motion.button key="step-btn" type="button" className="btn btn-outline-success" onClick={addStep}>
                            Add new step
                        </motion.button>
                    </AnimatePresence>
                </div>
                <hr/>
                <div className="row justify-content-between g-0">
                    <button className="btn btn-success col-5" type="submit" disabled={false}>Submit</button>
                    <button className="btn btn-outline-success col-5" type="button" onClick={cancelSubmit}>Cancel</button>
                </div>
            </form>
        </div> 
    </RecipePageWrapper>
};

function makeNewIng(i: number, ing?: FirebaseIngredient) {
    return {
        id: `ing${i}`,
        name: ing?.name || '',
        amount: ing?.amount?.toString() || '',
        unit: ing?.unit || ''
    } as FormIngredient
};

function makeNewStep(i: number, step?: string) {
    return {id: `step-${i}`, step: step || ''};
};

export function formErrors(formData: FormData) {
    const errors = {} as FormErrors;
    let ings = false;
    let steps = false;

    for (const [name, value] of formData.entries()) {
        if ((name === 'description' || name === 'name') && !value.toString().trim()) {
            errors[name] = 'required';
        }
        else if (name.endsWith('-name')) {
            ings = true;
            if (!value.toString().trim()) {
                errors[name] = 'required';
                errors['ingredients'] = 'empty';
            }
        }
        else if (name.startsWith('step')) {
            steps = true;
            if (!value.toString().trim()) {
                errors[name] = 'required';
                errors['steps'] = 'empty';
            }
        }
        else if (name.endsWith('amount') && isNaN(+value)) {
            errors[name] = 'NaN';
        }
        else if (name === 'description' && value.length > 1000) {
            errors[name] = 'too long';
        }
    }

    if (!ings)
        errors['ingredients'] = 'required';
    if (!steps) 
        errors['steps'] = 'required';

    return errors;
}

function transformToRequestData(f: FormData) {
    const ingredients = {} as {[key: string]: any};
    const steps: string[] = [];

    for (const [key, value] of f.entries()) {
        const val = value.toString();
        if (key.startsWith('ing')) {
            const dash = key.indexOf('-');
            const id = key.slice(0, dash);
            const type = key.slice(dash + 1);

            if (!(id in ingredients)) {
                ingredients[id] = {};
            }
            switch(type) {
                case 'amount':
                    if (+val) ingredients[id][type] = +val;
                    break;
                case 'unit':
                    if (val) ingredients[id][type] = val;
                    break;
                case 'name':
                    ingredients[id][type] = val.trim();
                    break;
            }
        }
        else if (key.startsWith('step')) {
            steps.push(val.trim());
        }
    };
    const cleanedIngredients = Object.values(ingredients) as FirebaseIngredient[];

    const data = {
        name: f.get('name')?.toString() || '',
        description: f.get('description')?.toString() || '',
        imagePath: f.get('imagePath')?.toString() || '',
        ingredients: cleanedIngredients,
        steps
    };
    return data as FirebaseRecipe;
}