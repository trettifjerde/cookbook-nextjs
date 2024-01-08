export const detailsClasses = {
    container: 'relative min-h-[450px] md:min-h-[600px] mb-6 flex items-end',
    header: 'relative w-full mt-12 py-6 px-4 md:px-8 xl:py-12 xl:px-10 text-white bg-dark-green-shadow min-h-details-info rounded-t-lg',
    imageContainer: {
        base: 'absolute inset-0 flex justify-center items-center',
        withImage: 'animate-recipe-details-bg',
        withoutImage: 'bg-dark-green-shadow',
        currentClass(img: string) {
            return `${this.base} ${img ? this.withImage : this.withoutImage}`;
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