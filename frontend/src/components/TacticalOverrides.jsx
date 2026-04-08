import { Button } from '../ui/Button';
import styles from './styles/TacticalOverrides.module.css';

function TacticalOverrides({
  onDangerTrigger,
  dangerDisabled,
  selectedApodDate,
  setSelectedApodDate,
  handleApodSubmit,
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

      {isNasaMediaPage ? null : (
        <div className={styles.toggleList}>
          <form onSubmit={handleApodSubmit} className={styles.apodForm}>
            <div className={styles.apodFormLabel}>APOD DATE</div>
            <div className={styles.apodFormRow}>
              <input
                type="date"
                value={selectedApodDate}
                max={today}
                onChange={(event) => setSelectedApodDate(event.target.value)}
              />
            </div>
            <div className={styles.apodFormRow}>
              <Button className={styles.apodFormButton}>
                ▶ FETCH APOD
              </Button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default TacticalOverrides;
