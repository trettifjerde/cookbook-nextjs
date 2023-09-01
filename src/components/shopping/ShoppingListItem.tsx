import { Ingredient } from "@/helpers/types";
import { memo, useCallback } from "react";

function ShoppingListItem({item, onEdit, onDelete} : {
    item: Ingredient, onEdit: (item: Ingredient) => void, onDelete: (item: Ingredient) => void
}) {
    const getItemInfo = useCallback(() => {
        let info = item.name;
        if (item.amount) {
            info += ` (${item.amount}`;
            if (item.unit) {
                info += ` ${item.unit}`;
            }
            info += ')';
        }
        return info;
    }, [item]);

    return (
        <div className="list-group-item ingredient interactive">
            <div className="ingredient-text">{getItemInfo()}</div>
            <div className="btn-group-sm">
                <button className="btn btn-outline-warning" onClick={() => onEdit(item)}>Edit</button>
                <button className="btn btn-outline-danger" onClick={() => onDelete(item)}>Delete</button>
            </div>
        </div>
    )
}

export default memo(ShoppingListItem);