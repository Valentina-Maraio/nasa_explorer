import { ErrorMessage } from '../../ui/ErrorMessage';
import { LoadingState } from '../../ui/LoadingState';
import sharedStyles from '../../../style/ares/shared.module.css';
import styles from '../../../style/ares/RightColumnBottom.module.css';

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
      <section className={`dashboard-panel ${styles.logPanel}`}>
        <div className={sharedStyles.panelHeading}>SELECTED MEDIA</div>
        {selectedMediaItem ? (
          <div className={styles.mediaInspector}>
            <div className={styles.mediaInspectorHeader}>
              <strong>{selectedMediaItem.title}</strong>
              <span>{selectedMediaItem.center} · {selectedMediaItem.media_type.toUpperCase()}</span>
            </div>
            <div className={styles.mediaInspectorPreview}>
              {mediaPreviewVideo ? (
                <video controls preload="metadata" className={styles.mediaInspectorAsset}>
                  <source src={mediaPreviewVideo.href} type="video/mp4" />
                </video>
              ) : mediaPreviewImage ? (
                <img
                  src={mediaPreviewImage.href}
                  alt={selectedMediaItem.title}
                  className={styles.mediaInspectorAsset}
                />
              ) : selectedMediaItem.thumbnail ? (
                <img
                  src={selectedMediaItem.thumbnail}
                  alt={selectedMediaItem.title}
                  className={styles.mediaInspectorAsset}
                />
              ) : (
                <div className={styles.mediaCardFallback}>NO PREVIEW ASSET</div>
              )}
            </div>
            <p className={styles.mediaInspectorDescription}>
              {selectedMediaItem.description || 'No description available for this NASA media asset.'}
            </p>
            <a href={mediaPreviewVideo?.href || mediaPreviewImage?.href || selectedMediaItem.thumbnail || '#'} target="_blank" rel="noreferrer" className={sharedStyles.inlineLink}>
              Open selected asset
            </a>
          </div>
        ) : (
          <LoadingState message="▸ SELECT A MEDIA RESULT" minHeight="140px" />
        )}
      </section>
    );
  }

  return (
    <section className={`dashboard-panel ${styles.logPanel}`}>
      <div className={sharedStyles.panelHeading}>MISSION LOG</div>
      {neoError ? <ErrorMessage message={neoError} onRetry={() => fetchNeo(today)} /> : null}
      {activeTab === 'mars' && marsError ? <ErrorMessage message={marsError} onRetry={() => fetchManifest('curiosity')} /> : null}
      <div className={styles.logList}>
        {neoLoading && !neo ? (
          <LoadingState message="▸ BUFFERING APPROACH LOG..." minHeight="120px" />
        ) : visibleMissionLog.length > 0 ? (
          visibleMissionLog.map((item) => (
            <div key={item.id} className={`${styles.logItem} ${item.isPotentiallyHazardous ? styles.logItemDanger : ''}`}>
              <div className={styles.logTime}>{item.approachDateTime || item.approachDate}</div>
              <div className={styles.logBody}>
                <strong>{item.name}</strong>
                <span>{formatNumber(item.missDistanceKilometers)} km miss distance</span>
                <span>{formatNumber(item.relativeVelocityKilometersPerSecond, 2)} km/s</span>
              </div>
            </div>
          ))
        ) : (
          <div className={sharedStyles.emptyState}>No matching NEO events for the selected filter.</div>
        )}
      </div>
    </section>
  );
}

export default RightColumnBottom;
