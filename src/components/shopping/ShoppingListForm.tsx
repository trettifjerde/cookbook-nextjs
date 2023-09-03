import { FormEventHandler, useCallback, useEffect, useRef, useState } from "react";

import { shoppingListActions } from "../../store/shoppingListState";
import { useStoreDispatch, useStoreSelector } from "@/store/store";
import { FirebaseIngredient, Ingredient } from "@/helpers/types";
import { generalActions } from "@/store/generalState";
import { castIngredClientToDb, castIngredDbToClient } from "@/helpers/casters";
import { updateShoppingList } from "@/helpers/dataClient";
import { ING_AMOUNT, ING_NAME, ING_UNIT, getIngredientErrorLog, ingredientErrorsInit, validateIngredient } from "@/helpers/forms";
import ShoppingListFormItem from "./ShoppingFormtem";
import useErrors from "@/helpers/useErrors";

const ShoppingListForm = () => {
    const {selectedItem: item, items} = useStoreSelector(state => state.shoppingList);
    const dispatch = useStoreDispatch();
    const formRef = useRef<HTMLFormElement>(null);

    const {errors, setErrors, clearErrors, touchField} = useErrors(ingredientErrorsInit);
    
    const submitForm = async (ing: FirebaseIngredient) => {
        dispatch(generalActions.setSubmitting(true));

        const {submitFn, message} = prepareIngredientSubmit(item.id, ing, items);

        if (!submitFn) {
            dispatch(generalActions.flashToast({text: message, isError: true}));
            return;
        }

        const res = await submitFn();
        if ('error' in res) 
            dispatch(generalActions.flashToast({text: res.error, isError: true}));
        else {
            dispatch(shoppingListActions.updateItem(res));
            dispatch(generalActions.flashToast({text: message, isError: false}))
        }
    };

    const validateForm: FormEventHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const {cleanIngredient, errors: errs} = validateIngredient(formData);

        if (errs) 
            setErrors(errs);
        else 
            submitForm(cleanIngredient);
    };

    const clearForm = () => {
        dispatch(shoppingListActions.clearItem());
        clearErrors();
        formRef.current?.reset();
    };

    const registerTouch = useCallback((v: string) => touchField('general', v), [touchField]);

    return (
        <div className="row">
            <div className="col">
                <form onSubmit={validateForm} autoComplete="false" ref={formRef}>
                    <input type="hidden" name="id" value={item.id} />
                    <div className="row mb-2 g-2">
                        <div className="col-8 form-group">
                            <ShoppingListFormItem type="text" label="Name" name={ING_NAME} defaultValue={item.name} 
                                showError={errors.general.has(ING_NAME)} registerTouch={registerTouch} />
                        </div>
                        <div className="col-2 form-group">
                            <ShoppingListFormItem type="number" label="Amount" name={ING_AMOUNT} defaultValue={item.amount} 
                                showError={errors.general.has(ING_AMOUNT)} registerTouch={registerTouch} />
                        </div>
                        <div className="col-2 form-group">
                            <ShoppingListFormItem type="text" label="Units" name={ING_UNIT} defaultValue={item.unit} 
                                showError={errors.general.has(ING_UNIT)} registerTouch={registerTouch} />
                        </div>
                    </div>
                    <div className="row align-items-center row-cols-auto mg-2 g-2">
                        <div className="col">
                            <button type="submit" className="btn-success btn">{item.id ? 'Edit' : 'Add'}</button>
                        </div>
                        <div className="col">
                            <button type="button" className="btn btn-outline-secondary" onClick={clearForm}>Clear</button>
                        </div>
                        <div className="col text-danger form-text text-end flex-grow-1">{getIngredientErrorLog(errors.general)}</div>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default ShoppingListForm;

function prepareIngredientSubmit(id: string, ing: FirebaseIngredient, items: Ingredient[]) {
    let submitFn;
    let message;

    if (id) {
        submitFn = updateShoppingList.bind(null, {id, ing});
        message = `Item updated: ${ing.name}`;
    }
    else {
        const [existId, updatedIng] = checkIfIngredExists(id, ing, items);
        if (existId) {
            if (updatedIng) {
                submitFn = updateShoppingList.bind(null, {id: existId, ing: updatedIng});
                message = `Item updated: ${ing.name}`;
            }
            else {
                submitFn = null;
                message = 'Item already on the list: ' + ing.name;
            }
        }
        else {
            submitFn = updateShoppingList.bind(null, {ing});
            message = `Item added: ${ing.name}`;
        }
    }
    return {submitFn, message};
}

function checkIfIngredExists(id: string, ingredient: FirebaseIngredient, items: Ingredient[]) : [string, FirebaseIngredient | null] {
    const ing = castIngredDbToClient(id, ingredient);

    const ex = items.find(it => it.name === ing.name && it.unit === ing.unit);
    if (ex) {
        if (ing.amount)
            return [ex.id, castIngredClientToDb({...ex, amount: ex.amount + ing.amount})];
        else
            return [ex.id, null];
    }
    else 
        return ['', null];
}