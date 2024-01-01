import ShoppingList from "@/components/shopping/ShoppingList";
import ShoppingListAlert from "@/components/shopping/ShoppingListAlert";
import ShoppingListForm from "@/components/shopping/ShoppingListForm";
import { HR } from "@/components/ui/elements/misc";

export default async function ShoppingListPage() {
    return <>
        <ShoppingListForm />
        <HR/> 
        <ShoppingList />
        <ShoppingListAlert />
    </>
}