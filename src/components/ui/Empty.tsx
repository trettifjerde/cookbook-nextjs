export default function EmptyComponent({message}: {message: string}) {
    return <div className='fadeIn h-full flex items-center justify-center'>{message}</div>;
}