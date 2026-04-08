import { Button } from '../ui/Button';
import { ErrorMessage } from '../ui/ErrorMessage';
import { LoadingState } from '../ui/LoadingState';
import { Pagination } from '../ui/Pagination';
import styles from './styles/MediaReconPanel.module.css';

function MediaReconPanel({
  mediaQuery,
  mediaResults,
  mediaLoading,
  selectedMediaAsset,
  mediaError,
  handleMediaQueryChange,
  handleMediaSubmit,
  handleMediaSelect,
  searchMedia,
  mediaCurrentPage,
  mediaTotalPages,
  mediaTotalResults,
  handleMediaPageChange,
  formatNumber,
}) {
  return (
    <div className={`dashboard-panel ${styles.visualPanel}`}>
      <div className={styles.visualHeader}>
        <div className={styles.panelHeading}>MEDIA RECONNAISSANCE</div>
        <div className={styles.feedBadges}>
          <span className={styles.feedBadgeMuted}>{formatNumber(mediaTotalResults)} RESULTS</span>
          <span className={styles.feedBadge}>PAGE {mediaCurrentPage}</span>
        </div>
      </div>


      {mediaError ? <ErrorMessage message={mediaError} onRetry={() => searchMedia(mediaQuery, mediaCurrentPage)} /> : null}

      {mediaLoading && mediaResults.length === 0 ? (
        <LoadingState message="▸ SWEEPING NASA MEDIA ARCHIVES..." minHeight="180px" />
      ) : (
        <div className={styles.resultsRegion}>
          <div className={styles.mediaReconGrid}>
            {mediaResults.map((item) => (
              <button
                key={item.nasa_id}
                type="button"
                className={`${styles.mediaCard} ${item.nasa_id === selectedMediaAsset ? styles.mediaCardActive : ''}`}
                onClick={() => handleMediaSelect(item.nasa_id)}
              >
                {item.thumbnail ? (
                  <img src={item.thumbnail} alt={item.title} className={styles.mediaCardImage} loading="lazy" />
                ) : (
                  <div className={styles.mediaCardFallback}>NO THUMBNAIL</div>
                )}
                <div className={styles.mediaCardFooter}>
                  <strong>{item.title}</strong>
                </div>
              </button>
            ))}
          </div>
          <div className={styles.resultsPagination}>
            <form onSubmit={handleMediaSubmit} className={styles.mediaSearchForm}>
              <label className={styles.apodField}>
                <input
                  type="text"
                  value={mediaQuery}
                  onChange={handleMediaQueryChange}
                  placeholder="apollo, nebula, saturn, mars..."
                />
              </label>
              <Button type="submit" loading={mediaLoading} className={styles.mediaSearchButton}>▶ EXECUTE SEARCH</Button>
            </form>
            <Pagination
              currentPage={mediaCurrentPage}
              totalPages={mediaTotalPages}
              onPageChange={handleMediaPageChange}
              className={styles.resultsPager}
              style={{ marginTop: 0 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaReconPanel;
