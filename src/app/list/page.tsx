import ShoppingList from "@/components/shopping/ShoppingList";
import ShoppingListAlert from "@/components/shopping/ShoppingListAlert";
import ShoppingListForm from "@/components/shopping/ShoppingListForm";

export default async function ShoppingListPage() {
    return <div className="row mb-4">
        <div className="col-xs-10">
            <ShoppingListForm />
            <hr/> 
            <ShoppingList />
            <ShoppingListAlert />
        </div>
    </div>
}