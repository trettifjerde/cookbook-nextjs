import { Variants } from "framer-motion";

export const TRANSLATE_Y = '-15px';

export const shLiClasses = {
    base: `min-h-[3rem] px-3 py-2`,
    item: 'relative group transition-colors duration-200',
    border: 'border-x border-gray-200 first:rounded-t-md first:border-t even:border-y last:rounded-b-md last:border-b-[1px]',
    get(selected: boolean) {
        return `${this.base} ${this.item} ${this.border} ${selected ? 'bg-green-shadow' : ''}`
    },
    skeleton() {
        return `${this.base} ${this.border} skeleton`
    }
};

export const manageItemClasses = 'mt-1 flex flex-row items-center gap-2 transition-hidden-btn shlist-btn-group';

export const shLiVariants : Variants = {
    hidden: {
        opacity: 0,
        transform: `translateY(${TRANSLATE_Y})`
    },
    visible: {
        opacity: 1,
        transform: 'translateY(0)'
    },
    pending: {
        opacity: 0.4,
        transform: 'translateY(0)'
    }
}