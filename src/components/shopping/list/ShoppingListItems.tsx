'use client'

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useStoreDispatch, useStoreSelector } from "@/store/store";
import { generalActions } from "@/store/general";
import { listActions } from "@/store/list";

import { Ingredient } from "@/helpers/types";
import { statusCodeToMessage } from "@/helpers/client-helpers";
import { deleteIngredient } from "@/helpers/server-actions/list-actions";

import ConfirmationModal from "../../ui/ConfirmationModal";
import ShoppingListItem from "./ShoppingListItem";
import { shLiClasses, shLiVariants } from "./classes";

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
                    dispatch(listActions.delete({id, name}));
                    break;

                default:
                    dispatch(generalActions.setError(statusCodeToMessage(response.status)));
            }

            setPendingId('');
        }
    }

    return <>
        {list.length > 0 && <div>
            <AnimatePresence mode="popLayout">
            {
                list.map(item => (
                    <motion.div layout="preserve-aspect" variants={shLiVariants} key={item.id} 
                        initial="hidden" animate={pendingId === item.id ? 'pending' : 'visible'} exit="hidden"
                        className={shLiClasses.get(selectedItem.id === item.id)}
                    >

                        <ShoppingListItem item={item} onDelete={setItemToDelete} />

                    </motion.div>
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

