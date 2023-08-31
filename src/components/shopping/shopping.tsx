'use client';
import useRedirectOnLogout from "@/helpers/useRedirectOnLogout";
import ShoppingList from "./ShoppingList";
import ShoppingListForm from "./ShoppingListForm";
import PageWrapper from "../PageWrapper";

export default function Shopping() {
    useRedirectOnLogout();

    return <PageWrapper className="row mb-4">
        <div className="col-xs-10">
            <ShoppingListForm />
            <hr/>      
            <ShoppingList />
        </div>
    </PageWrapper>
}