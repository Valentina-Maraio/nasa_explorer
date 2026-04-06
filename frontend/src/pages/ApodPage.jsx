import { useEffect, useState } from 'react';
import { useApod } from '../hooks/useApod';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Button } from '../components/ui/Button';
import styles from './styles/ApodPage.module.css';

function ApodPage() {
  const today = new Date().toISOString().split('T')[0];
  const { data: apod, loading, error, fetchApod } = useApod();
  const [selectedDate, setSelectedDate] = useState(today);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const hasApod = Boolean(apod);
  const isImageApod = hasApod && apod.media_type === 'image';
  const isVideoApod = hasApod && apod.media_type === 'video';
  const heroTitle = apod?.title || 'ASTRONOMY PICTURE OF THE DAY';
  const heroDate = apod?.date || selectedDate;

  useEffect(() => {
    if (!isDescriptionOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsDescriptionOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isDescriptionOpen]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchApod(selectedDate);
  };

  const handleRetry = () => {
    fetchApod(selectedDate);
  };

  const controlsPanel = (
    <div className={`dashboard-panel ${styles.overlayPanel} ${styles.sideMenuControlsPanel}`}>
      <h3 className="panel-title">CONTROLS</h3>
      <form onSubmit={handleSubmit} className={styles.controlsForm}>
        <div className={styles.controlsField}>
          <label className={styles.controlsLabel}>
            SELECT DATE
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            max={today}
            className={styles.dateInput}
          />
        </div>
        <Button type="submit">▶ APOD</Button>
      </form>
    </div>
  );

  const insightsPanel = (
    <div className={`dashboard-panel ${styles.overlayPanel}`}>
      <h3 className="panel-title">AI SAYS ABOUT IT</h3>
      {apod ? (
        <div className={`stats-container ${styles.insightsGrid}`}>
          <div className={`stat-box ${styles.insightStatBox}`}>
            <div className="stat-box-label">TITLE LENGTH</div>
          </div>
          <div className={`stat-box ${styles.insightStatBox}`}>
            <div className="stat-box-label">DESC LENGTH</div>
          </div>
        </div>
      ) : (
        <div className={styles.emptyHint}>
          ▸ Insights will appear after fetch.
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.page}>
      <h2 className="panel-title text-4xl mb-8">♠ ASTRONOMY PICTURE OF THE DAY</h2>

      {error && !hasApod ? (
        <ErrorMessage message={error} onRetry={handleRetry} />
      ) : (
        <div className={styles.imageApodLayout}>
          <div className={styles.heroColumn}>
            <section className={`dashboard-panel ${styles.heroStage}`}>
              {isImageApod && apod?.url && (
                <div className={styles.heroImageLayer} aria-hidden="true">
                  <img src={apod.url} alt="" className={styles.heroImage} />
                </div>
              )}

              {isVideoApod && apod?.url && (
                <div className={styles.heroImageLayer}>
                  <iframe
                    title="APOD Video"
                    src={apod.url}
                    className={`${styles.heroImage} ${styles.mediaVideo}`}
                  />
                </div>
              )}

              <div className={styles.infoHoverGroup}>
                <button
                  type="button"
                  className={styles.infoButton}
                  aria-label="Show APOD description"
                  disabled={!apod}
                  onClick={() => setIsDescriptionOpen(true)}
                >
                  i
                </button>
              </div>

              {!hasApod && (
                <div className={styles.prefetchAnimationWrap}>
                  <div className={styles.prefetchAnimation} aria-hidden="true">
                    <div className={styles.prefetchOrbit}>
                      <div className={styles.prefetchOrbiter} />
                    </div>
                    <div className={styles.prefetchCore} />
                    <div className={styles.prefetchSparkA} />
                    <div className={styles.prefetchSparkB} />
                  </div>
                  <p className={styles.prefetchText}>
                    {loading ? '▸ CONNECTING TO NASA FEED...' : '▸ SELECT A DATE AND FETCH APOD'}
                  </p>
                </div>
              )}

              {loading && hasApod && (
                <div className={styles.heroLoadingOverlay}>
                  <div className={styles.loadingStage}>
                    <div className={styles.loadingRing} />
                  </div>
                </div>
              )}
            </section>

            <div className={styles.heroMetaBlock}>
              <h3 className={`panel-title text-2xl ${styles.heroTitle}`}>{heroTitle}</h3>
            </div>
          </div>

          <aside className={styles.sideMenu}>
            <div className={styles.sideMenuCalendar}>
              {controlsPanel}
            </div>
            {insightsPanel}
          </aside>

          {isDescriptionOpen && (
            <div
              className={styles.descriptionDialogOverlay}
              role="presentation"
              onClick={() => setIsDescriptionOpen(false)}
            >
              <div
                className={styles.descriptionDialog}
                role="dialog"
                aria-modal="true"
                aria-label="APOD description"
                onClick={(event) => event.stopPropagation()}
              >
                <div className={styles.descriptionDialogHeader}>
                  <h3 className="panel-title">DESCRIPTION</h3>
                  <button
                    type="button"
                    className={styles.descriptionDialogClose}
                    aria-label="Close description dialog"
                    onClick={() => setIsDescriptionOpen(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className={styles.descriptionContent}>
                  <p className={styles.descriptionText}>{apod?.explanation || 'No description available.'}</p>
                  {apod.copyright && (
                    <p className={styles.copyrightText}>◈ Copyright: {apod.copyright}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ApodPage;