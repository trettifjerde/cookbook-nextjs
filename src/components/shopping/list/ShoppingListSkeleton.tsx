import { TRANSLATE_Y, shLiClasses } from "./classes";

export default function ShoppingListSkeleton() {

    return <div style={{transform: `translateY(${TRANSLATE_Y})`}}>
        {[0, 1, 2, 3, 4].map(i => <div key={i} className={shLiClasses.skeleton()} style={{animationDelay: `.${i}s`}}></div>)}
    </div>
}