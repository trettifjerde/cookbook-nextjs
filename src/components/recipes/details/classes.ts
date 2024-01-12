export const detailsClasses = {
    container: 'relative min-h-[100vh] md:min-h-[75vh] mb-6 flex items-end',
    header: 'relative w-full mt-[20vh] py-6 px-4 md:px-8 xl:py-12 xl:px-10 text-white bg-dark-green-shadow min-h-details-info rounded-t-lg',
    imageContainer: {
        base: 'absolute inset-0 flex justify-center items-center bg-dark-green-shadow',
        animate: 'animate-recipe-details-bg',
        currentClass(animate: boolean) {
            return `${this.base} ${animate ? this.animate : ''}`;
        }
    },
    detailsBlock(skeleton?: boolean) {
        return `mb-6 ${skeleton ? 'animate-fadeUp' : ''}`
    },
    blockHeading: 'text-xl font-medium mb-6',
    ul: 'border border-gray-200 rounded-md divide-y',
    ol: 'border border-transparent divide-y list-decimal list-inside marker:text-green marker:font-medium',
    li: 'p-3'
}