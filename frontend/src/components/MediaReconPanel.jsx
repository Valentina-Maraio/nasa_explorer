import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/Button';
import { CelestialLoader } from '../ui/CelestialLoader';
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
  mediaAssetFiles,
  handleMediaPageChange,
  formatNumber,
}) {
  const [previewItem, setPreviewItem] = useState(null);

  const closePreview = useCallback(() => {
    setPreviewItem(null);
  }, []);

  useEffect(() => {
    if (!previewItem) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closePreview();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [previewItem, closePreview]);

  const handleCardClick = useCallback((item) => {
    handleMediaSelect(item.nasa_id);
    setPreviewItem(item);
  }, [handleMediaSelect]);

  const previewVideoAsset = useMemo(
    () => mediaAssetFiles.find((file) => /\.mp4($|\?)/i.test(file.href)) || null,
    [mediaAssetFiles],
  );

  const previewImageAsset = useMemo(() => {
    const imageFiles = mediaAssetFiles.filter((file) => /\.(jpe?g|png|webp|gif)($|\?)/i.test(file.href));
    return imageFiles.find((file) => !/~thumb/i.test(file.href)) || imageFiles[0] || null;
  }, [mediaAssetFiles]);

  const isPreviewAssetReady = previewItem && previewItem.nasa_id === selectedMediaAsset;
  const previewSrcImage = isPreviewAssetReady
    ? (previewImageAsset?.href || previewItem?.thumbnail || '')
    : (previewItem?.thumbnail || '');
  const previewSrcVideo = isPreviewAssetReady ? previewVideoAsset?.href : null;

  return (
    <>
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
          <CelestialLoader kind="satellite" message="▸ SWEEPING NASA MEDIA ARCHIVES..." minHeight="180px" />
        ) : (
          <div className={styles.resultsRegion}>
            <div className={styles.mediaReconGrid}>
              {mediaResults.map((item) => (
                <button
                  key={item.nasa_id}
                  type="button"
                  className={`${styles.mediaCard} ${item.nasa_id === selectedMediaAsset ? styles.mediaCardActive : ''}`}
                  onClick={() => handleCardClick(item)}
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

      {previewItem ? (
        <div className={styles.previewOverlay} onClick={closePreview}>
          <div className={styles.previewDialog} onClick={(event) => event.stopPropagation()}>
            <div className={styles.previewHeader}>
              <strong className={styles.previewTitle}>{previewItem.title}</strong>
              <button type="button" className={styles.previewClose} onClick={closePreview}>CLOSE</button>
            </div>
            <div className={styles.previewBody}>
              {previewItem.media_type === 'video' ? (
                previewSrcVideo ? (
                  <video
                    src={previewSrcVideo}
                    className={styles.previewVideo}
                    controls
                    autoPlay
                    playsInline
                  />
                ) : (
                  <CelestialLoader kind="satellite" message="▸ SWEEPING MEDIA ARCHIVE..." minHeight="180px" />
                )
              ) : (
                <img
                  src={previewSrcImage}
                  alt={previewItem.title}
                  className={styles.previewImage}
                />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default MediaReconPanel;
