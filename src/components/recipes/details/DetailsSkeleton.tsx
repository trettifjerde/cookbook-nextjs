import { detailsClasses as classes } from "./classes";

export default function DetailsSkeleton() {
    return <>
        <div className={classes.container}>
            <div className={classes.imageContainer.currentClass(false)}></div>
            <div className={classes.header}></div>
        </div>

        <div className={classes.detailsBlock()}>
            <h5 className={classes.blockHeading}>Ingredients</h5>
            <ul className={classes.ul}>
                { 
                    [0, 1, 2, 3, 4].map((i) => <li key={i} className={`skeleton min-h-[3rem] ${classes.li}`} style={{animationDelay: `.${i}s`}}></li>)
                }
            </ul>
        </div>

        <div className={classes.detailsBlock()}>
            <h5 className={classes.blockHeading}>Steps</h5>
            <ol className={classes.ol}>
                { [0, 1, 2, 3].map((i) => <li key={i} className={`skeleton ${classes.li}`} style={{animationDelay: `.${i}s`}}></li>) }
            </ol>
        </div>
    </>
}