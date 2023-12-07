'use client'

import { ForwardedRef, forwardRef, memo, useState } from "react";
import { useStoreDispatch, useStoreSelector } from "@/store/store";
import { listActions } from "@/store/list";
import { Ingredient } from "@/helpers/types";
import { deleteIngredient } from "@/helpers/list-actions";
import ConfirmationModal from "../ui/ConfirmationModal";
import { statusCodeToMessage } from "@/helpers/client-helpers";
import { AnimatePresence, motion } from "framer-motion";

export default function ShoppingListItems() {

    const [itemToDelete, setItemToDelete] = useState<Ingredient|null>(null); 
    const [pendingId, setPendingId] = useState('');

    const list = useStoreSelector(state => state.list.list);
    const selectedItem = useStoreSelector(state => state.list.selectedItem);
    const dispatch = useStoreDispatch();

    const deleteItem = async () => {
        if (itemToDelete) {
            const {id, name} = itemToDelete;

            setItemToDelete(null);
            setPendingId(id);

            const response = await deleteIngredient(id);

            switch (response.status) {
                case 200:
                    dispatch(listActions.delete({id}));
                    break;

                default:
                    dispatch(listActions.setAlert({message: statusCodeToMessage(response.status), isError: true}));
            }

            setPendingId('');
        }
    }

    return <>
        {list.length > 0 && <div className="list-group">
            <AnimatePresence mode="popLayout">
            {
                list.map(item => (
                    <ShoppingListItem 
                        key={item.id} 
                        item={item}
                        pending={pendingId === item.id}
                        selected={selectedItem && selectedItem.id === item.id}
                        onDelete={setItemToDelete}
                        />
                    ))
            }
            </AnimatePresence>
        </div>
        }

        { list.length === 0 && <div className="text-center fadeIn">No items in the list</div>}

        <ConfirmationModal 
            visible={!!itemToDelete} 
            closeModal={() => setItemToDelete(null)} 
            onConfirm={() => deleteItem()}> 
                Delete item <span className="b">{itemToDelete?.name}</span>?
        </ConfirmationModal>
    </>
};

const variants = {
    hidden: {
        opacity: 0,
        transform: 'translateY(-15px)'
    },
    visible: {
        opacity: 1,
        transform: 'translateY(0)'
    },
    pending: {
        opacity: 0.4,
        transform: 'translateY(0)'
    }
}

const SHLI = forwardRef(({item, selected, pending, onDelete} : {
    item: Ingredient, selected: boolean, pending: boolean, onDelete: (item: Ingredient) => void
}, ref: ForwardedRef<HTMLDivElement>) => {
    const dispatch = useStoreDispatch();

    return <motion.div layout="preserve-aspect" ref={ref} variants={variants} 
        initial="hidden" animate={pending ? 'pending' : 'visible'} exit="hidden"
        className={`list-group-item ingredient ${selected ? 'selected' : ''}`}>
        <div className="ingredient-text">{getItemInfo(item)}</div>
        <div className="btn-group-sm">
            <button className="btn btn-outline-warning" onClick={() => dispatch(listActions.selectItem(item))}>Edit</button>
            <button type="button" className="btn btn-outline-danger" onClick={() => onDelete(item)}>Delete</button>
        </div>
    </motion.div>
});

const ShoppingListItem = memo(SHLI);

function getItemInfo(item: Ingredient) {
    let info = item.name;
    if (item.amount) {
        info += ` (${item.amount}`;
        if (item.unit) {
            info += ` ${item.unit}`;
        }
        info += ')';
    }
    return <span>{info}</span>;
}