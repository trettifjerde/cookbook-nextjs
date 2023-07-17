'use client';
import { useCallback, useState, useRef, FormEventHandler } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import './RecipeForm.css';
import { FirebaseIngredient, FirebaseRecipe, FormErrors, FormIngredient, FormRecipe } from "@/helpers/types";
import { useRouter } from "next/navigation";
import useRedirectOnLogout from "@/helpers/useRedirectOnLogout";
import { useStoreDispatch, useStoreSelector } from "@/store/store";
import { recipesActions } from "@/store/recipesState";
import useListManager from "@/helpers/useListManger";
import { generalActions } from "@/store/generalState";
import { fetchData } from "@/helpers/utils";


export default function RecipeForm({recipe}: {recipe: FormRecipe}) {
    useRedirectOnLogout();

    const user = useStoreSelector(state => state.general.user);
    const dispatch = useStoreDispatch();

    const recipeId = recipe.id;
    const router = useRouter();
    const {list: ings, addItem: addIng, removeItem: removeIng} = useListManager<FirebaseIngredient, FormIngredient>(recipe.ingredients, makeNewIng);
    const {list: steps, addItem: addStep, removeItem: removeStep, moveItem: moveStep} = useListManager<string, {id: string, step: string}>(recipe.steps, makeNewStep);
    const [errors, setErrors] = useState<FormErrors>({});
    const contTop = useRef<HTMLDivElement>(null);

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

    return <div className="fadeIn">
        <div className="label-row" ref={contTop}>
            <h3>{ recipe.id ? 'Edit recipe' : 'Add recipe'}</h3> 
            {Object.keys(errors).length > 0 && <p className="form-text text-danger">Form contains errors</p>}
        </div>
        <div className="r">        
            <form className="recipe-form" onSubmit={handleSubmit}>     
                <div className="form-group">
                    <div className="label-row">
                        <label htmlFor="name">Name</label>
                        { errors.name && <p className="form-text text-danger">Name is required</p>}
                    </div>
                    <input type="text" id="name" name="name" className={`form-control ${errors.name ? 'invalid' : ''}`} defaultValue={recipe.name} />
                </div>
                <hr/>
                <div className="form-group">
                    <div className="label-row">
                        <label htmlFor="description">Description</label>
                        { errors.description && <p className="form-text text-danger">Description is required</p>}
                    </div>
                    <textarea className={`form-control larger ${errors.description ? 'invalid' : ''}`} name="description" defaultValue={recipe.description}></textarea>
                    
                </div>
                <hr/>
                <div className="form-group">
                    <label htmlFor="imagePath">Image URL</label>
                    <input type="text" className="form-control" name="imagePath" defaultValue={recipe.imagePath}/>
                </div>
                <hr/>
                <div className="form-group">
                    <div className="label-row">
                        <label>Ingredients</label>
                        { errors.ingredients  && <p className="form-text text-danger">
                            Ingredients are required
                        </p>}
                    </div>
                    <TransitionGroup>
                        { ings.map(ing => (
                            <CSSTransition key={ing.id} timeout={300} classNames='list-item'>
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
                            </CSSTransition>
                        )) }
                    </TransitionGroup>
                    <button type="button" className="btn btn-outline-success mt-2" onClick={addIng}>
                        Add new ingredient
                    </button>
                </div>
                <hr/>
                <div className="form-group">
                    <div className="label-row">
                        <label>Steps</label>
                        { errors.steps && <p className="form-text text-danger">
                            Steps cannot be empty or longer than 1000 characters each
                        </p>}
                    </div>
                    <TransitionGroup component="ol" className="list-group list-group-flush steps">
                        { steps.map(step => <CSSTransition key={step.id} timeout={300} classNames="list-item">
                            <li className="list-group-item row step">
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
                            </li>
                        </CSSTransition>)}     
                    </TransitionGroup>
                    <button type="button" className="btn btn-outline-success" onClick={addStep}>
                        Add new step
                    </button>
                </div>
                <hr/>
                <div className="row justify-content-between g-0">
                    <button className="btn btn-success col-5" type="submit" disabled={false}>Submit</button>
                    <button className="btn btn-outline-success col-5" type="button" onClick={cancelSubmit}>Cancel</button>
                </div>
            </form>
        </div> 
    </div>
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