'use client'
import { useStoreDispatch, useStoreSelector } from "@/store/store";
import PopUp from "../ui/PopUp";
import { useCallback } from "react";
import { listActions } from "@/store/list";
import { Alert } from "@/helpers/types";

export default function ShoppingListAlert() {
    const alert = useStoreSelector(state => state.list.alert);
    const dispatch = useStoreDispatch();

    const hide = useCallback((a: Alert|null) => dispatch(listActions.setAlert(a)), [dispatch]);

    return <PopUp alert={alert} setPopUp={hide}/>
}