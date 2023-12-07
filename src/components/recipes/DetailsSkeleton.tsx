export default function DetailsSkeleton() {
    return <div className="skeleton-cont">
        <div className="detail-header">
            <div className="detail-header-img"></div>
            <div className="detail-header-text"></div>
        </div>
        <div className="detail-block">
            <h5>Ingredients</h5>
            <ul className="list-group skeleton">
                <li className="list-group-item"></li>
                <li className="list-group-item"></li>
            </ul>
        </div>
        <div className="detail-block">
            <h5>Steps</h5>
            <ol className="list-group list-group-flush list-group-numbered skeleton">
                <li className="list-group-item"></li>
                <li className="list-group-item"></li>
            </ol>
        </div>
    </div>
}