import { useState } from 'react';
import { LoadingState } from '../../ui/LoadingState';
import sharedStyles from '../../../style/ares/shared.module.css';
import visualStyles from '../../../style/ares/visual.module.css';
import styles from '../../../style/ares/VisualPanel.module.css';

function VisualPanel({
  activeTab,
  apod,
  apodLoading,
  apodError,
  epic,
  neo,
  manifest,
  today,
  primaryFeed,
  fetchApod,
  formatNumber,
}) {
  const [isApodDialogOpen, setIsApodDialogOpen] = useState(false);
  const hasBackgroundImage = primaryFeed?.type !== 'video' && Boolean(primaryFeed?.url);

  return (
    <>
      <div className={`dashboard-panel ${visualStyles.visualPanel}`}>
        <div className={visualStyles.visualHeader}>
          <div className={sharedStyles.panelHeading}>VISUAL RECONNAISSANCE</div>
          <div className={visualStyles.feedBadges}>
            <span className={visualStyles.feedBadge}>REC</span>
            <span className={visualStyles.feedBadgeMuted}>CAM-04</span>
          </div>
        </div>

        <div className={visualStyles.visualStage}>
          {apodLoading && !apod ? (
            <LoadingState message="▸ ACQUIRING VISUAL FEED..." minHeight="100%" />
          ) : primaryFeed ? (
            <>
              {primaryFeed.type === 'video' ? (
                <iframe title={primaryFeed.title} src={primaryFeed.url} className={visualStyles.visualMedia} />
              ) : (
                <div
                  className={visualStyles.visualBackgroundImage}
                  style={{ backgroundImage: `url(${primaryFeed.url})` }}
                  role="img"
                  aria-label={primaryFeed.title}
                />
              )}

              <button
                type="button"
                className={visualStyles.apodInfoButton}
                onClick={() => setIsApodDialogOpen(true)}
                aria-label="Open image description"
                title="Open image description"
                disabled={!apod?.explanation}
              >
                i
              </button>

              <div className={visualStyles.crosshairVertical} aria-hidden="true" />
              <div className={visualStyles.crosshairHorizontal} aria-hidden="true" />
              <div className={visualStyles.crosshairCore} aria-hidden="true" />
              <div className={visualStyles.visualDataTopLeft}>
                <span>COORD: {epic?.leadImage?.centroidCoordinates ? `${epic.leadImage.centroidCoordinates.lat.toFixed(2)}°, ${epic.leadImage.centroidCoordinates.lon.toFixed(2)}°` : 'SYNCING'}</span>
                <span>DATE: {apod?.date || today}</span>
              </div>
              <div className={visualStyles.visualDataBottomRight}>
                <span>MAG: {formatNumber(neo?.closestObject?.absoluteMagnitude, 1)}</span>
                <span>FILTER: {(apod?.media_type || 'IMAGE').toUpperCase()}</span>
              </div>
            </>
          ) : (
            <LoadingState message="▸ NO FEED AVAILABLE" minHeight="100%" />
          )}
        </div>

        <div className={visualStyles.visualCaption}>
          <h3>{primaryFeed?.title || 'Awaiting telemetry feed'}</h3>
          <p>{primaryFeed?.subtitle || 'Telemetry will populate as NASA sources respond.'}</p>
        </div>
      </div>


      {isApodDialogOpen && apod?.explanation ? (
        <div className={visualStyles.apodDialogOverlay} onClick={() => setIsApodDialogOpen(false)}>
          <div className={visualStyles.apodDialog} onClick={(event) => event.stopPropagation()}>
            <div className={visualStyles.apodDialogHeader}>
              <h3>{apod.title}</h3>
              <button
                type="button"
                className={visualStyles.apodDialogClose}
                onClick={() => setIsApodDialogOpen(false)}
                aria-label="Close image description"
              >
                x
              </button>
            </div>
            <p className={visualStyles.apodDialogText}>{apod.explanation}</p>
            {hasBackgroundImage ? null : (
              <p className={visualStyles.apodDialogNote}>Description is shown in dialog while video feed remains embedded in panel.</p>
            )}
          </div>
        </div>
      ) : null}

      {activeTab === 'neo' ? (
        <div className={`dashboard-panel ${styles.detailPanel}`}>
          <div className={sharedStyles.panelHeading}>NEO LOG ANALYSIS</div>
          <div className={styles.neoMetricsGrid}>
            <div className={styles.metricCard}><span>HAZARDOUS</span><strong>{formatNumber(neo?.hazardousCount)}</strong></div>
            <div className={styles.metricCard}><span>SAFE PASS</span><strong>{formatNumber((neo?.elementCount || 0) - (neo?.hazardousCount || 0))}</strong></div>
            <div className={styles.metricCard}><span>NEXT TARGET</span><strong>{neo?.nextApproach?.name || '--'}</strong></div>
          </div>
        </div>
      ) : null}

      {activeTab === 'mars' ? (
        <div className={`dashboard-panel ${styles.detailPanel}`}>
          <div className={sharedStyles.panelHeading}>MARS RECON DETAILS</div>
          {manifest ? (
            <div className={styles.marsGrid}>
              <div className={styles.metricCard}><span>STATUS</span><strong>{manifest.status?.toUpperCase() || '--'}</strong></div>
              <div className={styles.metricCard}><span>MAX DATE</span><strong>{manifest.maxDate || '--'}</strong></div>
              <div className={styles.metricCard}><span>CAMERAS</span><strong>{manifest.latestPhotos?.cameras?.length || 0}</strong></div>
            </div>
          ) : (
            <LoadingState message="▸ MANIFEST PENDING" minHeight="120px" />
          )}
        </div>
      ) : null}
    </>
  );
}

export default VisualPanel;
