export default function ShoppingListSkeleton() {

    return <div className="border border-gray-200 rounded-md divide-y">
        {[0, 1, 2, 3, 4, 5].map(i => <div key={i} className="min-h-btn-square animate-flicker-reverse" style={{animationDelay: `.${i}s`}}></div>)}
    </div>
}