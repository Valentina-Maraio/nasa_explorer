import { CelestialLoader } from '../ui/CelestialLoader';
import SolarFlareTimeline from './SolarFlareTimeline';
import FlareClassChart from './FlareClassChart';
import SunPhoto from './SunPhoto';
import styles from './styles/SolarFlarePanel.module.css';

function SolarFlarePanel({
  data,
  loading,
  error,
  fromFallback,
  retry,
}) {
  if (loading && !data) {
    return (
      <section className={`${styles.solarPanel} ${styles.solarLoadingState}`}>
        <CelestialLoader kind="sun" message="▸ SYNCING SOLAR FLARE DATA..." minHeight="60vh" size="large" />
      </section>
    );
  }

  const events = data?.events || [];
  const summary = data?.summary || { total: 0, byClass: {} };

  return (
    <section className={`${styles.solarPanel}`}>
      <div className={styles.panelHeader}>
        <div className={styles.panelHeading}>SOLAR ACTIVITY</div>
        <span className={styles.status}>
          {data?.status === 'ok' ? 'TRACKING' : 'UNAVAILABLE'}
        </span>
      </div>

      {fromFallback && (
        <div className={styles.fallbackBanner}>
          FALLBACK CACHE ACTIVE
        </div>
      )}

      {error && (
        <div className={styles.errorBanner}>
          SOLAR LINK DEGRADED ·{' '}
          <button className={styles.retryButton} type="button" onClick={retry}>
            RETRY
          </button>
        </div>
      )}

      {data?.message && (
        <div className={styles.unavailable}>{data.message}</div>
      )}

      {events.length > 0 && (
        <div className={styles.chartsGrid}>
          <FlareClassChart summary={summary} />
          <SolarFlareTimeline events={events} />
          <SunPhoto />
        </div>
      )}
    </section>
  );
}

export default SolarFlarePanel;
