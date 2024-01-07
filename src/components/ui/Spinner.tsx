export default function Spinner({root}: {root?: boolean}) {
    return (
        <div className={`s-cont ${root ? 's-root': ''}`}>
            <div className='s-spin'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}