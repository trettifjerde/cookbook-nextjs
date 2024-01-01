export default function ShoppingListSkeleton() {

    return <div className="border border-gray-200 rounded-md divide-y">
        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="min-h-btn-square even:bg-gray-100 even:animate-gray-flicker odd:animate-white-flicker"></div>)}
    </div>
}