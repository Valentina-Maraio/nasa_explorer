import { Link } from 'react-router-dom';
import dangerIcon from '../../../assets/danger.svg';
import sharedStyles from '../../../style/ares/shared.module.css';
import styles from '../../../style/ares/TacticalOverrides.module.css';

function TacticalOverrides({ hazardousOnly, setHazardousOnly, setActiveTabAndRoute }) {
  return (
    <section className="dashboard-panel">
      <div className={sharedStyles.panelHeading}>TACTICAL OVERRIDES</div>
      <div className={styles.actionGrid}>
        <div className={`${styles.actionLink} ${styles.actionLinkDanger}`}>
          <img src={dangerIcon} alt="" aria-hidden="true" className={styles.actionLinkIcon} />
          DANGER
        </div>
        <button type="button" className={`${styles.actionLink} ${styles.actionLinkInfo}`} onClick={() => setActiveTabAndRoute('nasa-media')}>ENTER MEDIA RECON</button>
      </div>

      <div className={styles.toggleList}>
        <label className={styles.toggleRow}>
          <span>HAZARDOUS ONLY</span>
          <input type="checkbox" checked={hazardousOnly} onChange={() => setHazardousOnly((value) => !value)} />
        </label>
      </div>
    </section>
  );
}

export default TacticalOverrides;
