import { ErrorMessage } from '../ui/ErrorMessage';
import { LoadingState } from '../ui/LoadingState';
import styles from './styles/RightColumnBottom.module.css';

function RightColumnBottom({
  activeTab,
  selectedMediaItem,
  mediaPreviewVideo,
  mediaPreviewImage,
  neoError,
  marsError,
  neoLoading,
  neo,
  visibleMissionLog,
  fetchNeo,
  fetchManifest,
  formatNumber,
  today,
}) {
  if (activeTab === 'nasa-media') {
    return (
      <section className={`dashboard-panel ${styles.logPanel} ${styles.selectedMediaPanel}`}>
        <div className={styles.panelHeading}>SELECTED MEDIA</div>
        {selectedMediaItem ? (
          <div className={styles.mediaInspector}>
            <div className={styles.mediaInspectorHeader}>
              <strong>{selectedMediaItem.title}</strong>
              <span>{selectedMediaItem.center} · {selectedMediaItem.media_type.toUpperCase()}</span>
            </div>
            <p className={styles.mediaInspectorDescription}>
              {selectedMediaItem.description || 'No description available for this NASA media asset.'}
            </p>
          </div>
        ) : (
          <LoadingState message="▸ SELECT A MEDIA RESULT" minHeight="140px" />
        )}
      </section>
    );
  }

  return (
    <section className={`dashboard-panel ${styles.logPanel}`}>
      <div className={styles.panelHeading}>MISSION LOG</div>
      {neoError ? <ErrorMessage message={neoError} onRetry={() => fetchNeo(today)} /> : null}
      {activeTab === 'mars' && marsError ? <ErrorMessage message={marsError} onRetry={() => fetchManifest('curiosity')} /> : null}
      <div className={styles.logList}>
        {neoLoading && !neo ? (
          <LoadingState message="▸ BUFFERING APPROACH LOG..." minHeight="120px" />
        ) : visibleMissionLog.length > 0 ? (
          visibleMissionLog.map((item) => (
            <div key={item.id} className={`${styles.logItem}`}>
              <div className={styles.logTime}>{item.approachDateTime || item.approachDate}</div>
              <div className={styles.logBody}>
                <strong>{item.name}</strong>
                <span>{formatNumber(item.missDistanceKilometers)} km miss distance</span>
                <span>{formatNumber(item.relativeVelocityKilometersPerSecond, 2)} km/s</span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>No NEO events available for today.</div>
        )}
      </div>
    </section>
  );
}

export default RightColumnBottom;
