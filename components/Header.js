import Image from 'next/image';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header} id="header">
      <div className={styles.headerInner}>
        <div className={styles.logoSection}>
          <Image
            src="/assets/logo.webp"
            alt="PromptWS Logo"
            width={160}
            height={44}
            className={styles.logoImage}
            priority
          />
        </div>
        <div className={styles.tagline}>
          <span className={styles.statusDot}></span>
          <span>AI Workflow Engine</span>
        </div>
      </div>
    </header>
  );
}
