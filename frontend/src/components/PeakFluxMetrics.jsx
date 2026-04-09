import styles from './styles/PeakFluxMetrics.module.css';

function formatDateTime(isoString) {
  if (!isoString) return '--';
  
  try {
    const date = new Date(isoString);
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}Z`;
  } catch {
    return isoString;
  }
}

function PeakFluxMetrics({ latest, events, summary }) {
  const xClassFlares = events.filter((e) => e.classType?.startsWith('X'));
  const mClassFlares = events.filter((e) => e.classType?.startsWith('M'));
  
  const highestFlare = xClassFlares.length > 0 
    ? xClassFlares[xClassFlares.length - 1]
    : mClassFlares.length > 0 
      ? mClassFlares[mClassFlares.length - 1]
      : latest;

  return (
    <div className={styles.card}>      
      <div className={styles.metricsGrid}>
        <div className={styles.metric}>
          <span className={styles.label}>TOTAL FLARES</span>
          <strong className={styles.value}>{summary.total}</strong>
        </div>
        
        <div className={styles.metric}>
          <span className={styles.label}>X-CLASS</span>
          <strong className={styles.value}>{summary.byClass.X || 0}</strong>
        </div>
        
        <div className={styles.metric}>
          <span className={styles.label}>M-CLASS</span>
          <strong className={styles.value}>{summary.byClass.M || 0}</strong>
        </div>
        
        <div className={styles.metric}>
          <span className={styles.label}>C-CLASS</span>
          <strong className={styles.value}>{summary.byClass.C || 0}</strong>
        </div>
      </div>

      {highestFlare && (
        <>
          <div className={styles.divider} />
          <div className={styles.latestEvent}>
            <div className={styles.eventLabel}>STRONGEST EVENT</div>
            <div className={styles.eventClass}>{highestFlare.classType || 'UNKNOWN'}</div>
            <div className={styles.eventTime}>PEAK: {formatDateTime(highestFlare.peakTime)}</div>
            {highestFlare.sourceLocation && (
              <div className={styles.eventLocation}>LOC: {highestFlare.sourceLocation}</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default PeakFluxMetrics;
