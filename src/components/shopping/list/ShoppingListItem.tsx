'use client'

import { Ingredient } from "@/helpers/types";
import { listActions } from "@/store/list";
import { useStoreDispatch } from "@/store/store";
import { SmallButton } from "../../ui/elements/buttons";
import { manageItemClasses } from "./classes";

export default function ShoppingListItem({item, onDelete}: { item: Ingredient, onDelete: (item: Ingredient) => void}) {
    const dispatch = useStoreDispatch();

    return <>
        <span className="align-text-top">{getItemInfo(item)}</span>
        <div className={manageItemClasses}>
            <SmallButton color="yellowOutline" onClick={() => dispatch(listActions.selectItem(item))}>Edit</SmallButton>
            <SmallButton color="redOutline" onClick={() => onDelete(item)}>Delete</SmallButton>
        </div>
    </>
};

function getItemInfo(item: Ingredient) {
    return `${item.name}${item.amount ? ` (${item.amount}${item.unit ? ` ${item.unit}` : ''})` : ''}`;
}