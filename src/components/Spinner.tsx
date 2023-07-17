import styles from './s.module.scss';

export default function Spinner({root}: {root?: boolean}) {
    return (
        <div className={`${styles.c} ${root ? styles.r : ''}`}>
            <div className={styles.sp}>
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