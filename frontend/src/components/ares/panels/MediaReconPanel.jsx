import { Button } from '../../ui/Button';
import { ErrorMessage } from '../../ui/ErrorMessage';
import { LoadingState } from '../../ui/LoadingState';
import { Pagination } from '../../ui/Pagination';
import sharedStyles from '../../../style/ares/shared.module.css';
import visualStyles from '../../../style/ares/visual.module.css';
import styles from '../../../style/ares/MediaReconPanel.module.css';

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
    <div className={`dashboard-panel ${visualStyles.visualPanel}`}>
      <div className={visualStyles.visualHeader}>
        <div className={sharedStyles.panelHeading}>MEDIA RECONNAISSANCE</div>
        <div className={visualStyles.feedBadges}>
          <span className={visualStyles.feedBadgeMuted}>{formatNumber(mediaTotalResults)} RESULTS</span>
          <span className={visualStyles.feedBadge}>PAGE {mediaCurrentPage}</span>
        </div>
      </div>

      <form onSubmit={handleMediaSubmit} className={styles.mediaSearchForm}>
        <label className={styles.apodField}>
          <span>QUERY</span>
          <input
            type="text"
            value={mediaQuery}
            onChange={handleMediaQueryChange}
            placeholder="apollo, nebula, saturn, mars..."
          />
        </label>
        <Button type="submit" loading={mediaLoading}>▶ EXECUTE SEARCH</Button>
      </form>

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
            <Pagination
              currentPage={mediaCurrentPage}
              totalPages={mediaTotalPages}
              onPageChange={handleMediaPageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaReconPanel;
