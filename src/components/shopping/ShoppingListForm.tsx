'use client'
import { useCallback, useEffect, useRef, useState } from "react";
import { ING_NAME, ING_AMOUNT, ING_UNIT } from "@/helpers/types";
import { getIngredientErrorLog, ingredientErrorsInit, ingredientNotChanged, validateIngredient } from "@/helpers/forms";
import ShoppingListFormItem from "./ShoppingFormtem";
import useErrors from "@/helpers/useErrors";
import { sendIngredient } from "@/helpers/list-actions";
import { useStoreDispatch, useStoreSelector } from "@/store/store";
import { listActions } from "@/store/list";
import { statusCodeToMessage } from "@/helpers/client-helpers";
import SubmitButton from "../ui/SubmitButton/SubmitButton";

export default function ShoppingListForm() {

    const formRef = useRef<HTMLFormElement>(null);

    const selectedItem = useStoreSelector(s => s.list.selectedItem);
    const dispatch = useStoreDispatch();

    const {errors, setErrors, clearErrors, touchField} = useErrors(ingredientErrorsInit);
    const [noChanges, setNoChanges] = useState(false);

    const registerTouch = useCallback((v: string) => touchField('general', v), [touchField]);

    const clearForm = () => {
        clearErrors();
        dispatch(listActions.selectItem(null));
    }

    const validateForm = async (formData: FormData) => {
        const {cleanIngredient, errors: errs} = validateIngredient(formData);

        if (errs) 
            setErrors(errs);

        else {

            if (ingredientNotChanged(selectedItem, cleanIngredient)) {
                setNoChanges(true);
                return;
            }

            const response = await sendIngredient(cleanIngredient, selectedItem.id);

            switch (response.status) {
                case 200:
                    const {data} = response;
                    switch (data.command) {
                        case 'add':
                            dispatch(listActions.add(data.ing));
                            break;
                        case 'update':
                            dispatch(listActions.update(data.ing));
                            break;
                        case 'merge': 
                            dispatch(listActions.merge({ing: data.ing, id: selectedItem.id}));
                            break;
                        case 'delete':
                            dispatch(listActions.delete({id: selectedItem.id, dupName: cleanIngredient.name}));
                            break;
                        default:
                            dispatch(listActions.setAlert({message: `Item ${cleanIngredient.name} is already on the list`, isError: true}));
                    }
                    break;
                default:
                    dispatch(listActions.setAlert({message: statusCodeToMessage(response.status), isError: true}));
            }
        }
    };

    useEffect(() => {
        formRef.current?.reset();
    }, [selectedItem, formRef]);

    return (<>
        <div className="row">
            <div className="col r">
                <form action={validateForm} autoComplete="off" ref={formRef} onFocus={() => setNoChanges(false)}>
                    <div className="row mb-2 g-2">
                        <div className="col-8 form-group">
                            <ShoppingListFormItem type="text" label="Name" name={ING_NAME} defaultValue={selectedItem.name} 
                                hasError={errors.general.has(ING_NAME)} registerTouch={registerTouch} />
                        </div>
                        <div className="col-2 form-group">
                            <ShoppingListFormItem type="number" label="Amount" name={ING_AMOUNT} defaultValue={selectedItem.amount} 
                                hasError={errors.general.has(ING_AMOUNT)} registerTouch={registerTouch} />
                        </div>
                        <div className="col-2 form-group">
                            <ShoppingListFormItem type="text" label="Units" name={ING_UNIT} defaultValue={selectedItem.unit} 
                                hasError={errors.general.has(ING_UNIT)} registerTouch={registerTouch} />
                        </div>
                    </div>
                    <div className="row align-items-center row-cols-auto mg-2 g-2">
                        <div className="col">
                            <SubmitButton className="btn-success btn">{selectedItem.id ? 'Edit' : 'Add'}</SubmitButton>
                            </div>
                        <div className="col">
                            <button type="button" className="btn btn-outline-secondary" onClick={clearForm}>Clear</button>
                        </div>
                        <div className="col text-danger form-text text-end flex-grow-1">
                            { getIngredientErrorLog(errors.general, noChanges) }</div>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}