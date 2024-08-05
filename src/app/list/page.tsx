import { redirect } from "next/navigation";
import getUserId from "@/helpers/server/cachers/token";
import ShoppingList from "@/components/shopping/ShoppingList";
import ShoppingListForm from "@/components/shopping/ShoppingListForm";
import { HR } from "@/components/ui/elements/misc";

export default async function ShoppingListPage() {
    if (!getUserId())
        redirect('/auth/login');
    
    return <div className="px-2 pb-4 h-full overflow-auto">
        <ShoppingListForm />
        <HR/> 
        <ShoppingList />
    </div>
}