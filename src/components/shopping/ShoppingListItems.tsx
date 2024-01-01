'use client'

import { forwardRef, memo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useStoreDispatch, useStoreSelector } from "@/store/store";
import { listActions } from "@/store/list";

import { Ingredient } from "@/helpers/types";
import { deleteIngredient } from "@/helpers/list-actions";
import { statusCodeToMessage } from "@/helpers/client-helpers";

import ConfirmationModal from "../ui/ConfirmationModal";
import { Button, SmallButton } from "../ui/elements/buttons";

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
        {list.length > 0 && <div>
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

        { list.length === 0 && <div className="text-center animate-fadeIn">No items in the list</div>}

        <ConfirmationModal 
            visible={!!itemToDelete} 
            closeModal={() => setItemToDelete(null)} 
            onConfirm={() => deleteItem()}> 
                Delete item <span className="font-bold">{itemToDelete?.name}</span>?
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

type SHLIProps = { 
    item: Ingredient, 
    selected: boolean, 
    pending: boolean, 
    onDelete: (item: Ingredient) => void
};

const shLiClass = {
    base: 'px-3 py-2 flex flex-row gap-2 items-center justify-between group transition-colors duration-200',
    border: 'border-x border-gray-200 first:rounded-t-md first:border-t even:border-y last:rounded-b-md last:border-b-[1px]',
    getClass(selected: boolean) {
        return `${this.base} ${this.border} ${selected ? 'bg-green-shadow' : ''}`
    }
};

const ShoppingListItem = memo(forwardRef<HTMLDivElement, SHLIProps>(({item, selected, pending, onDelete}, ref) => {
    const dispatch = useStoreDispatch();

    return <motion.div layout="preserve-aspect" ref={ref} variants={variants} 
        initial="hidden" animate={pending ? 'pending' : 'visible'} exit="hidden"
        className={shLiClass.getClass(selected)}>
            <div>{getItemInfo(item)}</div>
            <div className="flex flex-row gap-2 transition-hidden-btn duration-200 opacity-0 invisible group-hover:visible group-hover:opacity-100">
                <SmallButton color="yellow" onClick={() => dispatch(listActions.selectItem(item))}>Edit</SmallButton>
                <SmallButton color="red" onClick={() => onDelete(item)}>Delete</SmallButton>
            </div>
    </motion.div>
}));

function getItemInfo(item: Ingredient) {
    return `${item.name}${item.amount ? ` (${item.amount}${item.unit ? ` ${item.unit}` : ''})` : ''}`;
}