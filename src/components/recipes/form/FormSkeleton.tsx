import { formSkeletonInput, formSkeletonTextarea } from "../../ui/elements/forms"
import { HR } from "../../ui/elements/misc"

export default function EditFormSkeleton() {

    return <div className="px-2 py-4 translate-y-[-16px]">

        <div>
            <h3 className="text-3xl font-medium mb-8">Edit recipe</h3> 
        </div>

        <div>
            <label className="block font-bold text-md mb-2">Title</label>
            <div className={formSkeletonInput} />
        </div>
        <HR />
        <div>
            <label className="block font-bold text-md mb-2">Description</label>
            <div className={formSkeletonTextarea} />
        </div>
        <HR />
        <div>
            <label className="block font-bold text-md mb-2">Image file</label>
            <div className={formSkeletonTextarea} />
        </div>
        <HR />
        <div>
            <label className="block font-bold text-md mb-2">Ingredients</label>
            {[1, 2, 3].map(i => <div key={i} className="grid grid-cols-[1fr_1fr_2fr] gap-1">
                <div className={formSkeletonInput}></div>
                <div className={formSkeletonInput}></div>
                <div className={formSkeletonInput}></div>
            </div>)}
        </div>
        <HR />
        <div>
            <label className="block font-bold text-md mb-2">Steps</label>
            <ol className="list-decimal list-inside">
                {
                    [1, 2, 3].map(i => <li key={i} className="flex flex-row gap-2 py-3 items-center">
                        <div className="list-item"></div>
                        <div className={formSkeletonTextarea}></div>
                    </li>)
                }
            </ol>
        </div>

    </div>
}