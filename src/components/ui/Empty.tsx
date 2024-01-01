export default function EmptyComponent({message}: {message: string}) {
    return <div className='animate-fadeIn h-full flex items-center justify-center'>{message}</div>;
}