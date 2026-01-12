import styles from './Loading.module.css';

export default function Loading({ text = 'Loading...', fullScreen = false }) {
    return (
        <div className={`${styles.loadingContainer} ${fullScreen ? styles.fullScreen : ''}`}>
            <div className={styles.loadingSpinner}></div>
            <span className={styles.loadingText}>{text}</span>
        </div>
    );
}
