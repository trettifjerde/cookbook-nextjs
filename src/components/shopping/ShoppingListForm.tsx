'use client'

import { useCallback, useEffect, useRef, useState } from "react";

import { useStoreDispatch, useStoreSelector } from "@/store/store";
import { listActions } from "@/store/list";

import useErrors from "@/helpers/useErrors";
import { ING_NAME, ING_AMOUNT, ING_UNIT } from "@/helpers/types";
import { getIngredientErrorLog, ingredientErrorsInit, ingredientNotChanged, validateIngredient } from "@/helpers/forms";
import { sendIngredient } from "@/helpers/list-actions";
import { statusCodeToMessage } from "@/helpers/client-helpers";

import SubmitButton from "../ui/elements/SubmitButton";
import ShoppingListFormItem from "./ShoppingFormtem";
import { ErrorMessage } from "../ui/elements/misc";
import { Button } from "../ui/elements/buttons";

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

    return (<form action={validateForm} className="w-full px-2" autoComplete="off" ref={formRef} onFocus={() => setNoChanges(false)}>
        <div className="flex flex-row mb-2 gap-2">
            <ShoppingListFormItem className="grow" type="text" label="Name" name={ING_NAME} defaultValue={selectedItem.name} 
                hasError={errors.general.has(ING_NAME)} registerTouch={registerTouch} />

            <ShoppingListFormItem className="" type="number" label="Amount" name={ING_AMOUNT} defaultValue={selectedItem.amount} 
                hasError={errors.general.has(ING_AMOUNT)} registerTouch={registerTouch} />

            <ShoppingListFormItem className="" type="text" label="Units" name={ING_UNIT} defaultValue={selectedItem.unit} 
                hasError={errors.general.has(ING_UNIT)} registerTouch={registerTouch} />
        </div>
        <div className="flex flex-row items-center gap-2">
            <div className="flex flex-row gap-2">
                <SubmitButton>{selectedItem.id ? 'Edit' : 'Add'}</SubmitButton>
                <Button type="button" color="greenOutline" onClick={clearForm}>Clear</Button>
            </div>
            <div className="grow text-right">
                <ErrorMessage text={getIngredientErrorLog(errors.general, noChanges)} />
            </div>
        </div>
    </form>
    )
}