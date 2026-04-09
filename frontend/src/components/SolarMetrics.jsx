import PeakFluxMetrics from './PeakFluxMetrics';
import ActiveRegionActivity from './ActiveRegionActivity';
import styles from './styles/SolarMetrics.module.css';

function SolarMetrics({ solarFlares }) {
  const events = solarFlares?.data?.events || [];
  const summary = solarFlares?.data?.summary || { total: 0, byClass: {} };
  const latest = solarFlares?.data?.latest || null;

  return (
    <section className={`dashboard-panel ${styles.panel}`}>
      <div className={styles.panelHeading}>I'M HERE</div>
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
