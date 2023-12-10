export default function RecipeLoading() {
    return <>
        <div className="relative h-[60vh] mb-6">
            <div className="w-full h-full bg-dark-green-shadow flex justify-center items-center"></div>
            <div className="absolute bottom-0 left-0 right-0 px-8 py-6 text-white bg-dark-green-shadow min-h-recipe-item rounded-t-lg"></div>
        </div>

        <div className="fadeIn mb-6">
            <h5 className='text-xl font-medium mb-6'>Ingredients</h5>
            <ul className="border border-gray-200 rounded-md divide-y">
                { 
                    [1, 2, 3, 4, 5].map((i) => <li key={i} className="min-h-[2rem]"></li>)
                }
            </ul>
        </div>

        <div className="fadeIn mb-6">
            <h5 className='text-xl font-medium mb-6'>Steps</h5>
            <ol className="border border-transparent divide-y list-decimal list-inside">
                { [1, 2, 3, 4].map((step, i) => <li key={i} className="min-h-[2rem]"></li>) }
            </ol>
        </div>
    </>
}