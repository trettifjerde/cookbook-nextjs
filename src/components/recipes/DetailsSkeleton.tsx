export default function DetailsSkeleton() {
    return <>
        <div className="relative h-[60vh] mb-6">
            <div className="w-full h-full bg-dark-green-shadow flex justify-center items-center"></div>
            <div className="absolute bottom-0 left-0 right-0 px-8 py-6 text-white bg-dark-green-shadow min-h-details-info rounded-t-lg"></div>
        </div>

        <div className="mb-6">
            <h5 className='text-xl font-medium mb-6'>Ingredients</h5>
            <ul className="border border-gray-200 rounded-md divide-y">
                { 
                    [0, 1, 2, 3, 4].map((i) => <li key={i} className="bg-gray-100 min-h-[3rem] animate-flicker" style={{animationDelay: `.${i}s`}}></li>)
                }
            </ul>
        </div>

        <div className="mb-6">
            <h5 className='text-xl font-medium mb-6'>Steps</h5>
            <ol className="border border-transparent rounded-md divide-y list-decimal list-inside">
                { [0, 1, 2, 3].map((i) => <li key={i} className="bg-gray-100 p-3 animate-flicker" style={{animationDelay: `.${i}s`}}></li>) }
            </ol>
        </div>
    </>
}