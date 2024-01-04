'use client'

import { useCallback } from "react";
import { useStoreDispatch, useStoreSelector } from "@/store/store";
import { listActions } from "@/store/list";
import { Alert } from "@/helpers/types";
import PopUp from "../ui/PopUp";

export default function ShoppingListAlert() {
    const alert = useStoreSelector(state => state.list.alert);
    const dispatch = useStoreDispatch();

    const hide = useCallback((a: Alert|null) => dispatch(listActions.setAlert(a)), [dispatch]);

    return <PopUp alert={alert} setPopUp={hide}/>
}