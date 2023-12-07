import styles from './mini-spinner.module.scss';

export default function MiniSpinner({white, absolute}: {white?: boolean, absolute?: boolean}) {
    return <div className={`${styles.spinner} ${absolute ? styles.abs : ''} ${white ? styles.white : ''}`}>
        <div></div>
    </div>
}