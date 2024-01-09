import ShoppingList from "@/components/shopping/ShoppingList";
import ShoppingListForm from "@/components/shopping/ShoppingListForm";
import { HR } from "@/components/ui/elements/misc";

export default async function ShoppingListPage() {
    return <div className="px-2 pb-4 h-full overflow-auto">
        <ShoppingListForm />
        <HR/> 
        <ShoppingList />
    </div>
}