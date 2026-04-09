import { Button } from '../ui/Button';
import styles from './styles/TacticalOverrides.module.css';

function TacticalOverrides({
  onDangerTrigger,
  dangerDisabled,
  today,
  isNasaMediaPage,
}) {
  return (
    <section className={`dashboard-panel ${styles.tacticalPanel}`}>
      <div className={styles.panelHeading}>TACTICAL OVERRIDES</div>
      <div className={styles.actionGrid}>
        <button
          type="button"
          className={`${styles.actionLink} ${styles.actionLinkDanger}`}
          onClick={onDangerTrigger}
          disabled={dangerDisabled}
        >
          DANGER
        </button>
      </div>
    </section>
  );
}

export default TacticalOverrides;
