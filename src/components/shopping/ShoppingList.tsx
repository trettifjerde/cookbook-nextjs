'use client';
import { useCallback, useEffect, useState } from "react";

import { generalActions } from "../../store/generalState";
import { shoppingListActions } from '../../store/shoppingListState';

import ShoppingListItem from "./ShoppingListItem";
import ConfirmationModal from "../ConfirmationModal";
import '../../components/Modal.css';
import { Ingredient } from "@/helpers/types";
import { useStoreDispatch, useStoreSelector } from "@/store/store";
import Spinner from "../Spinner";
import { updateShoppingList } from "@/helpers/dataClient";

export default function ShoppingList() {
    const dispatch = useStoreDispatch();
    const shoppingList = useStoreSelector(state => state.shoppingList);
    const user = useStoreSelector(state => state.general.user);
    const [info, setInfo] = useState<{items: Ingredient[], isInitialized: boolean }>({items: [], isInitialized: false});

    const [itemToDeleteInfo, setItemToDeleteInfo] = useState({
        visible: false, 
        name: '', 
        id: ''
    }); 

    const editItem = useCallback((item: Ingredient) => {
        dispatch(shoppingListActions.selectItem(item));
        window.scrollTo({top: 0, behavior: 'smooth'});
    }, [dispatch]);

    const askDeleteConfirm = useCallback((item: Ingredient) => setItemToDeleteInfo({visible: true, name: item.name, id: item.id}), [setItemToDeleteInfo]);

    const closeModal = useCallback(() => setItemToDeleteInfo(prev => ({...prev, visible: false})), [setItemToDeleteInfo]);

    const deleteItem = useCallback(async () => {
        const id = itemToDeleteInfo.id;
        closeModal();
        
        if (!user) {
            dispatch(generalActions.flashToast({text: 'Authentication error', isError: true}))
            return;
        }

        dispatch(generalActions.setSubmitting(true));

        const response = await updateShoppingList({id});
        if ('error' in response) {
            dispatch(generalActions.flashToast({text: response.error, isError: true}));
        }
        else {
            dispatch(shoppingListActions.deleteItem(id));
            dispatch(generalActions.flashToast({text: `Item removed: ${itemToDeleteInfo.name}`, isError: false}));
        }

    }, [user, itemToDeleteInfo, dispatch, closeModal]);

    useEffect(() => setInfo({items: shoppingList.items, isInitialized: shoppingList.isInitialized}), [shoppingList]);

    return <div> 
        {info.items.length > 0 && <div className="list-group">
                {
                    info.items.map(item => (
                        <ShoppingListItem 
                            key={item.id} 
                            item={item}
                            onEdit={editItem}
                            onDelete={askDeleteConfirm}
                        />))
                }
            </div> 
        }

        { info.isInitialized && info.items.length === 0 && <div className="text-center">No items in the list</div>}

        {!info.isInitialized && <Spinner root/>}

        <ConfirmationModal question="Delete item" info={itemToDeleteInfo} onClose={closeModal} onConfirm={deleteItem}  />
    </div>
}