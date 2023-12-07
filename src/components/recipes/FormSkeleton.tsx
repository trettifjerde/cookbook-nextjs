export default function FormSkeleton({title}: {title: string}) {
    return <div className="skeleton-cont">
        <div className="label-row">
            <h3>{title}</h3> 
            <p className="form-text text-danger"></p>
        </div>    
        <form className="recipe-form skeleton">
            <div className="form-group">
                <div className="label-row">
                    <label>Title</label>
                </div>
                <input type="text" className="form-control" disabled />
            </div>    
            <hr/>
            <div className="form-group">
                <div className="label-row">
                    <label>Description</label>
                </div>
                <textarea className="form-control" disabled />
            </div>   
            <hr/>
            <div className="form-group">
                <div className="label-row">
                    <label>Image URL</label>
                </div>
                <input type="text" className="form-control" disabled />
            </div> 
            <hr/>
        </form> 
    </div>
}