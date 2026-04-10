import PeakFluxMetrics from './PeakFluxMetrics';
import ActiveRegionActivity from './ActiveRegionActivity';
import { CelestialLoader } from '../ui/CelestialLoader';
import styles from './styles/SolarMetrics.module.css';

function SolarMetrics({ solarFlares }) {
  if (solarFlares?.loading && !solarFlares?.data) {
    return (
      <section className={`dashboard-panel ${styles.panel}`}>
        <div className={styles.panelHeading}>SOLAR METRICS</div>
        <CelestialLoader
          kind="radar"
          message="▸ ACQUIRING SOLAR METRICS..."
          minHeight="140px"
        />
      </section>
    );
  }

  const events = solarFlares?.data?.events || [];
  const summary = solarFlares?.data?.summary || { total: 0, byClass: {} };
  const latest = solarFlares?.data?.latest || null;

  return (
    <section className={`dashboard-panel ${styles.panel}`}>
      <div className={styles.panelHeading}>SOLAR METRICS</div>
      <div className={styles.content}>
        {events.length > 0 && (
          <>
            <PeakFluxMetrics 
              latest={latest} 
              events={events} 
              summary={summary}
            />
            <ActiveRegionActivity events={events} />
          </>
        )}
      </div>
    </section>
  );
}

export default SolarMetrics;
