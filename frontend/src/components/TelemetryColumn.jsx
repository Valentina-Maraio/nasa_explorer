import { LoadingState } from '../ui/LoadingState';
import Gauge from './Gauge';
import styles from './styles/TelemetryColumn.module.css';

function TelemetryColumn({ countdown, neo, neoLoading, manifest, marsLoading, formatNumber }) {
  return (
    <aside className={styles.leftColumn}>
      <section className="dashboard-panel">
        <div className={styles.panelHeading}>02 RESERVES</div>
        <div className={styles.telemetryMetaGrid}>
          <div>
            <span>ETA</span>
            <strong>{countdown}</strong>
          </div>
          <div>
            <span>VELOCITY</span>
            <strong>{formatNumber(neo?.closestObject?.relativeVelocityKilometersPerSecond, 2)} km/s</strong>
          </div>
        </div>
      </section>

      <section className={`dashboard-panel ${styles.boredomPanel}`}>
        <div className={styles.panelHeading}>ASTEROID THREAT INDEX</div>
        {neoLoading && !neo ? <LoadingState message="▸ SCANNING NEO FEED..." minHeight="220px" /> : <Gauge value={neo?.hazardPercent || 0} />}
        <div className={styles.statList}>
          <div className={styles.statLine}><span>NEOs TRACKED</span><strong>{formatNumber(neo?.elementCount)}</strong></div>
          <div className={styles.statLine}><span>CLOSEST km</span><strong>{formatNumber(neo?.closestObject?.missDistanceKilometers)}</strong></div>
          <div className={styles.statLine}><span>MAX DIA m</span><strong>{formatNumber(neo?.closestObject?.estimatedDiameterMaxMeters, 1)}</strong></div>
        </div>
      </section>

      <section className="dashboard-panel">
        <div className={styles.panelHeading}>MARS RECON SNAPSHOT</div>
        {marsLoading && !manifest ? (
          <LoadingState message="▸ SYNCING CURIOSITY MANIFEST..." minHeight="160px" />
        ) : (
          <div className={styles.statList}>
            <div className={styles.statLine}><span>ROVER</span><strong>{manifest?.name || 'CURIOSITY'}</strong></div>
            <div className={styles.statLine}><span>LATEST SOL</span><strong>{formatNumber(manifest?.latestPhotos?.sol)}</strong></div>
            <div className={styles.statLine}><span>PHOTOS @ SOL</span><strong>{formatNumber(manifest?.latestPhotos?.totalPhotos)}</strong></div>
            <div className={styles.statLine}><span>TOTAL PHOTOS</span><strong>{formatNumber(manifest?.totalPhotos)}</strong></div>
          </div>
        )}
      </section>
    </aside>
  );
}

export default TelemetryColumn;
