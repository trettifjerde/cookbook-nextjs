import { FirebaseIngredient, FirebaseRecipe, Ingredient } from "./types";

export const ING_NAME = 'name';
export const ING_AMOUNT = 'amount';
export const ING_UNIT = 'unit';

export const RECIPE_NAME = 'name';
export const RECIPE_DESC = 'description';
export const RECIPE_IMAGE = 'imagePath';
export const RECIPE_INGREDIENTS = 'ingredients';
export const RECIPE_STEPS = 'steps';
export const RECIPE_ING = 'ing';
export const RECIPE_STEP = 'step';
export const RECIPE_STEP_ID = (i: number) => `${RECIPE_STEP}${i}-`;
export const RECIPE_ING_ID = (i: number) => `${RECIPE_ING}${i}-`;

export const recipeErrorsInit = () => ({
    general: new Set<string>(),
    ingredients: new Set<string>(),
    steps: new Set<string>()
});

export const ingredientErrorsInit = () => ({
    general: new Set<string>()
});

export function validateIngredient(formData: FormData, ingId='') {
    const errors = ingredientErrorsInit();
    const cleanIngredient = {} as FirebaseIngredient;

    const {name, amount, unit} = readIngredInfo(formData, ingId);

    if (name) 
        cleanIngredient[ING_NAME] = name;
    else
        errors.general.add(ingId + ING_NAME);
    
    if (amount) {
        if (validateAmount(amount)) 
            cleanIngredient[ING_AMOUNT] = +amount;
        else {
            errors.general.add(ingId + ING_AMOUNT);
        }
    }

    if (unit) {
        if (cleanIngredient.amount)
            cleanIngredient[ING_UNIT] = unit;
        else 
            errors.general.add(ingId + ING_AMOUNT);
    }

    return errors.general.size === 0 ? {cleanIngredient, errors: null} : {cleanIngredient: null, errors};
}

export function validateAmount(v: string) {
    return !isNaN(+v) && +v >= 0.01;
}

export function validateRecipe(formData: FormData) {
    const errors = recipeErrorsInit();
    const ingIds = new Set<string>();
    const cleanData : FirebaseRecipe = {
        name: '',
        description: '',
        imagePath: '',
        steps: [],
        ingredients: []
    };

    for (const [key, value] of formData.entries()) {
        const v = value.toString().trim();

        switch (key) {
            case RECIPE_DESC:
            case RECIPE_NAME:
            case RECIPE_IMAGE:
                if (v)
                    cleanData[key] = v;
                else 
                    errors.general.add(key);
                break;

            default:
                if (key.startsWith(RECIPE_STEP)) {
                    if (v)
                        cleanData.steps.push(v);
                    else {
                        errors.steps.add(key);
                    }
                }
                else if (key.startsWith(RECIPE_ING)) {
                    ingIds.add(key.slice(0, key.indexOf('-') + 1));
                }
        }
    }
    ingIds.forEach(ingId => {
        const {cleanIngredient, errors: ingErrors} = validateIngredient(formData, ingId);
        if (ingErrors) {
            ingErrors.general.forEach(ingField => errors.ingredients.add(ingField));
        }
        else {
            cleanData.ingredients.push(cleanIngredient);
        }
    })

    return Object.values(errors).every(s => s.size === 0) ? {data: cleanData, errors: null} : {data: null, errors};
}


function readIngredInfo(formData: FormData, ingId: string) {
    return {
        name: formData.get(ingId + ING_NAME)?.toString().trim(),
        amount: formData.get(ingId + ING_AMOUNT)?.toString().trim(),
        unit: formData.get(ingId + ING_UNIT)?.toString().trim(),
    }
}

export function getIngredientErrorLog(errors: Set<string>) {
    let errorStr = '';
    errors.forEach(error => {
        switch(error) {
            case ING_NAME:
                errorStr += 'Invalid name ';
                break;
            case ING_AMOUNT:
                errorStr += 'Invalid amount '
                break;
            case ING_UNIT:
                errorStr += 'To use units you must first specify the amount '
                break;
        }
    })
    return errorStr;
}