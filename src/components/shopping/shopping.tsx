'use client';
import useRedirectOnLogout from "@/helpers/useRedirectOnLogout";
import ShoppingList from "./ShoppingList";
import ShoppingListForm from "./ShoppingListForm";

export default function Shopping() {
    useRedirectOnLogout();

    return <div className="row mb-4 fadeIn">
        <div className="col-xs-10">
            <ShoppingListForm />
            <hr/>      
            <ShoppingList />
        </div>
    </div>
}