import styles from './LoadingAnimation.module.css';

export default function LoadingAnimation() {
  return (
    <div className={styles.loadingContainer} id="loading-animation">
      <div className={styles.loaderOrb}>
        <div className={styles.orbRing}></div>
        <div className={styles.orbRing}></div>
        <div className={styles.orbRing}></div>
        <div className={styles.orbCenter}></div>
      </div>
      <div className={styles.loadingText}>Forging your workflow</div>
      <div className={styles.loadingSubtext}>
        <span className={styles.dots}>
          Analyzing intent<span>.</span><span>.</span><span>.</span>
        </span>
      </div>
    </div>
  );
}
