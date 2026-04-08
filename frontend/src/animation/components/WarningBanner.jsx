import styles from './WarningBanner.module.css';

function WarningBanner({ visible }) {
  return visible ? <div className={styles.warningBanner}>WARNING</div> : null;
}

export default WarningBanner;
