import { RECIPE_IMAGE_FILE_FORMATS } from "./config";
import { FormIngredient, FormRecipe, ING_AMOUNT, ING_NAME, ING_UNIT, PreUploadFormRecipe, RECIPE_DESC, RECIPE_IMAGE_PATH, RECIPE_ING, RECIPE_NAME, RECIPE_STEP, RecipeIngredient } from "./types";

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
    const cleanIngredient = {} as RecipeIngredient;

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
        if (cleanIngredient[ING_AMOUNT])
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
    const cleanData : PreUploadFormRecipe = {
        title: '',
        description: '',
        imagePath: '',
        imageFile: null,
        steps: [],
        ingredients: []
    };

    for (const [key, value] of formData.entries()) {
        const valueOf = value.valueOf();

        if (typeof valueOf === 'string') {

            const v = value.toString().trim();

            switch (key) {
                case RECIPE_DESC:
                case RECIPE_NAME:
                    if (v)
                        cleanData[key] = v;
                    else 
                        errors.general.add(key);
                    break;
            
                case RECIPE_IMAGE_PATH:
                    if (v)
                        cleanData[key] = v;
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
        else {
            const file = valueOf as File;
            if (file.size) {
                if (RECIPE_IMAGE_FILE_FORMATS.includes(file.type))
                    cleanData.imageFile = file;
                else
                    errors.general.add(key);
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
    });
    
    if (cleanData.ingredients.length === 0)
        errors.ingredients.add('');
    if (cleanData.steps.length === 0)
        errors.steps.add('');

    return Object.values(errors).every(s => s.size === 0) ? {data: cleanData, errors: null} : {data: null, errors};
}

function readIngredInfo(formData: FormData, ingId: string) {
    return {
        name: formData.get(ingId + ING_NAME)?.toString().trim(),
        amount: formData.get(ingId + ING_AMOUNT)?.toString().trim(),
        unit: formData.get(ingId + ING_UNIT)?.toString().trim(),
    }
}

export function getIngredientErrorLog(errors: Set<string>, noChanges: boolean) {
    if (noChanges)
        return 'No changes to submit';


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

export function makeEmptyRecipe() {
    const data : FormRecipe = {
        title: '',
        steps: [],
        ingredients: [],
        description: '',
        imagePath: ''
    }
    return data;
}

export function ingredientNotChanged(selected: FormIngredient, updated: RecipeIngredient) {
    const initial : RecipeIngredient = {name: selected.name};
    if (selected.amount) 
        initial.amount = +selected.amount;
    
    if (selected.unit)
        initial.unit = selected.unit;

    return initial.name === updated.name && initial.amount === updated.amount && initial.unit === updated.unit;
}