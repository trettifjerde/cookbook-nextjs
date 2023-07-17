import { FormEventHandler, useCallback, useEffect, useRef, useState } from "react";

import { shoppingListActions } from "../../store/shoppingListState";
import { useStoreDispatch, useStoreSelector } from "@/store/store";
import { FormErrors, Ingredient } from "@/helpers/types";
import { generalActions } from "@/store/generalState";
import { castIngredClientToDb, castIngredFormDataToClient } from "@/helpers/casters";
import { updateShoppingList } from "@/helpers/dataClient";

const ShoppingListForm = () => {

    const {selectedItem : item, items} = useStoreSelector(state => state.shoppingList);
    const user = useStoreSelector(state => state.general.user);
    const dispatch = useStoreDispatch();

    const [errors, setErrors] = useState<FormErrors>({});
    const formEl = useRef<HTMLFormElement>(null);
    
    const submitForm = useCallback(async (formData: FormData) => {
        if (user) {
            dispatch(generalActions.setSubmitting(true));

            const {submitFn, message} = prepareIngredientSubmit(formData, items);

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
        }
    }, [items, user]);

    const validateIngredient: FormEventHandler = useCallback(async event => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const errors = checkIngredErrors(formData);

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        submitForm(formData);

    }, [setErrors, submitForm]);


    const clearForm = useCallback(() => dispatch(shoppingListActions.clearItem()), [dispatch]);

    useEffect(() => {
        if (formEl.current) {
            (formEl.current.elements.namedItem('id') as HTMLFormElement).value = item.id ? item.id : '';
            (formEl.current.elements.namedItem('name') as HTMLFormElement).value = item.name;
            (formEl.current.elements.namedItem('amount') as HTMLFormElement).value = item.amount;
            (formEl.current.elements.namedItem('unit') as HTMLFormElement).value = item.unit;
            (formEl.current.elements.namedItem('name') as HTMLFormElement).focus();
            setErrors({});
        }
    }, [item, formEl, setErrors]);

    return (
        <div className="row">
            <div className="col">
                <form onSubmit={validateIngredient} ref={formEl}>
                    <input type="hidden" name="id" />
                    <div className="row mb-2 g-2">
                        <div className="col-8 form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" name="name" className={`form-control ${errors.name ? 'invalid' : ''}`} />
                        </div>
                        <div className="col-2 form-group">
                            <label htmlFor="amount">Amount</label>
                            <input type="number" id="amount" name="amount" className={`form-control ${errors.amount ? 'invalid' : ''}`} />
                        </div>
                        <div className="col-2 form-group">
                            <label htmlFor="unit">Units</label>
                            <input type="text" id="unit" name="unit" className={`form-control ${errors.unit ? 'invalid' : ''}`} />
                        </div>
                    </div>
                    <div className="row align-items-center row-cols-auto mg-2 g-2">
                        <div className="col">
                            <button type="submit" className="btn-success btn">{item.id ? 'Edit' : 'Add'}</button>
                        </div>
                        <div className="col ">
                            <button type="button" className="btn btn-outline-secondary" onClick={clearForm}>Clear</button>
                        </div>
                        {Object.keys(errors).length > 0 && <div className="col text-danger form-text text-end flex-grow-1">{Object.values(errors).join('. ')}</div>}
                    </div>
                </form>
            </div>
        </div>
    )
}
export default ShoppingListForm;

function checkIngredErrors(formData: FormData) {
    const errors: FormErrors = {};
    for (const [key, value] of formData.entries()) {
        const val = value.toString().trim();

        if (key === 'name') {
            if (!val) {
                errors[key] = 'Name is required';
            }
        }
        else if (key === 'amount') {
            if (val && (isNaN(+val) || +val < 0.01)) {
                errors[key] = 'Invalid amount';
            }
        }
        else if (key === 'unit') {
            if (val) {
                const amount = formData.get('amount')?.toString() || '';
                if (!amount || isNaN(+amount) || +amount < 0.01) {
                    errors[key] = 'Cannot enter units without specifying amount'
                }
            }
        }
    }
    return errors;
}

function checkIfIngredExists(ingredient: Ingredient, items: Ingredient[]) : [string, Ingredient | null] {
    const ex = items.find(it => it.name === ingredient.name && it.unit === ingredient.unit);
    if (ex) {
        if (ingredient.amount)
            return [ex.id, {...ex, amount: ex.amount + ingredient.amount}];
        else
            return [ex.id, null];
    }
    else 
        return ['', null];
}

function prepareIngredientSubmit(formData: FormData, items: Ingredient[]) {
    const ingredient = castIngredFormDataToClient(formData);
    let submitFn;
    let message;

    if (ingredient.id) {
        submitFn = updateShoppingList.bind(null, {id: ingredient.id, ing: castIngredClientToDb(ingredient)});
        message = `Item updated: ${ingredient.name}`;
    }
    else {
        const [existId, updatedData] = checkIfIngredExists(ingredient, items);
        if (existId) {
            if (updatedData) {
                submitFn = updateShoppingList.bind(null, {id: existId, ing: castIngredClientToDb(updatedData)});
                message = `Item updated: ${ingredient.name}`;
            }
            else {
                submitFn = null;
                message = 'Item already on the list: ' + ingredient.name;
            }
        }
        else {
            submitFn = updateShoppingList.bind(null, {ing: castIngredClientToDb(ingredient)});
            message = `Item added: ${ingredient.name}`;
        }
    }
    return {submitFn, message};
}