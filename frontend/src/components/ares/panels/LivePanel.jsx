import sharedStyles from '../../../style/ares/shared.module.css';
import styles from '../../../style/ares/visual.module.css';
import {
  ARTEMIS_II_LIVE_EMBED_URL,
  ARTEMIS_II_LIVE_WATCH_URL,
} from '../../../pages/config/liveStream'

function LivePanel() {
  return (
    <div className={`dashboard-panel ${styles.visualPanel}`}>
      <div className={styles.visualHeader}>
        <div className={sharedStyles.panelHeading}>ARTEMIS II LIVE</div>
        <div className={styles.feedBadges}>
          <span className={styles.feedBadge}>LIVE STREAM</span>
          <span className={styles.feedBadgeMuted}>NASA TV / YT</span>
        </div>
      </div>

      <div className={styles.visualStage}>
        <iframe
          title="Artemis II Livestream"
          src={ARTEMIS_II_LIVE_EMBED_URL}
          className={styles.visualMedia}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default LivePanel;
