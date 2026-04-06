import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { useImageSearch } from '../hooks/useImageSearch';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { Pagination } from '../components/ui/Pagination';
import styles from './styles/NasaMediaPage.module.css';

function SixSquareLoader({ label = 'Loading preview' }) {
  return (
    <div className={styles.loaderFrame} aria-label={label} role="status">
      <div className={styles.loaderGrid}>
        <span className={styles.loaderSquare} />
        <span className={styles.loaderSquare} />
        <span className={styles.loaderSquare} />
        <span className={styles.loaderSquare} />
        <span className={styles.loaderSquare} />
        <span className={styles.loaderSquare} />
      </div>
    </div>
  );
}

function NasaMediaPage() {
  const mobileSelectedPanelRef = useRef(null);
  const mobileQueryRef = useRef(null);
  const [mobileReadyIdentity, setMobileReadyIdentity] = useState('');
  const [desktopReadyIdentity, setDesktopReadyIdentity] = useState('');
  const [desktopImageReadyIdentity, setDesktopImageReadyIdentity] = useState('');
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isPaginating, setIsPaginating] = useState(false);
  const [isDesktopPreviewOpen, setIsDesktopPreviewOpen] = useState(false);
  const [desktopPreviewMode, setDesktopPreviewMode] = useState(null);

  const {
    query,
    results,
    loading,
    selectedAsset,
    assetFiles,
    error,
    handleQueryChange,
    handleSubmit,
    loadAsset,
    searchMedia,
    currentPage,
    totalPages,
    totalResults,
    handlePageChange,
  } = useImageSearch('moon');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)');
    mobileQueryRef.current = mediaQuery;
    setIsMobileViewport(mediaQuery.matches);

    const handleMediaChange = (event) => {
      setIsMobileViewport(event.matches);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleMediaChange);
      return () => mediaQuery.removeEventListener('change', handleMediaChange);
    }

    mediaQuery.addListener(handleMediaChange);
    return () => mediaQuery.removeListener(handleMediaChange);
  }, []);

  const handleRetry = useCallback(() => {
    searchMedia(query, currentPage);
  }, [searchMedia, query, currentPage]);

  const selectedItem = useMemo(
    () => results.find((item) => item.nasa_id === selectedAsset),
    [results, selectedAsset],
  );

  const previewImageFile = useMemo(() => {
    const imageFiles = assetFiles.filter((file) => /\.(jpe?g|png|webp|gif)($|\?)/i.test(file.href));
    return imageFiles.find((file) => !/~thumb/i.test(file.href)) || imageFiles[0] || null;
  }, [assetFiles]);

  const previewImageHref = useMemo(
    () => previewImageFile?.href || selectedItem?.thumbnail || '',
    [previewImageFile, selectedItem],
  );

  const desktopPreviewImageHref = useMemo(
    () => previewImageFile?.href || '',
    [previewImageFile],
  );

  const embeddedMp4 = useMemo(
    () => assetFiles.find((file) => /\.mp4($|\?)/i.test(file.href)),
    [assetFiles],
  );
  const videoIdentity = useMemo(
    () => (embeddedMp4 ? `${selectedAsset}-${embeddedMp4.href}` : ''),
    [embeddedMp4, selectedAsset],
  );

  const imageIdentity = useMemo(
    () => (previewImageHref ? `${selectedAsset}-${previewImageHref}` : ''),
    [selectedAsset, previewImageHref],
  );

  const desktopImageIdentity = useMemo(
    () => (desktopPreviewImageHref ? `${selectedAsset}-${desktopPreviewImageHref}` : ''),
    [selectedAsset, desktopPreviewImageHref],
  );

  const closeDesktopPreview = useCallback(() => {
    setIsDesktopPreviewOpen(false);
    setDesktopPreviewMode(null);
  }, []);

  useEffect(() => {
    if (isMobileViewport) {
      closeDesktopPreview();
      return;
    }

    if (!isDesktopPreviewOpen) {
      return;
    }

    if (selectedAsset && embeddedMp4) {
      setDesktopPreviewMode('video');
      return;
    }

    if (selectedAsset && desktopPreviewImageHref) {
      setDesktopPreviewMode('image');
      return;
    }

    if (selectedAsset) {
      setDesktopPreviewMode('loading');
      return;
    }

    setDesktopPreviewMode(null);
  }, [closeDesktopPreview, desktopPreviewImageHref, embeddedMp4, isDesktopPreviewOpen, isMobileViewport, selectedAsset]);

  useEffect(() => {
    if (!isDesktopPreviewOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setDesktopPreviewMode(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isDesktopPreviewOpen]);

  const handleSelectAsset = useCallback((nasaId) => {
    setDesktopReadyIdentity('');
    setDesktopImageReadyIdentity('');

    if (!isMobileViewport) {
      setIsDesktopPreviewOpen(true);
      setDesktopPreviewMode('loading');
    }

    loadAsset(nasaId);

    if (isMobileViewport && mobileSelectedPanelRef.current) {
      requestAnimationFrame(() => {
        mobileSelectedPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [isMobileViewport, loadAsset]);

  const handleGalleryItemClick = useCallback((event) => {
    const { nasaId } = event.currentTarget.dataset;
    if (!nasaId) {
      return;
    }
    handleSelectAsset(nasaId);
  }, [handleSelectAsset]);

  const handlePaginationWithSpinner = useCallback((page) => {
    setIsPaginating(true);
    handlePageChange(page);
  }, [handlePageChange]);

  useEffect(() => {
    if (!loading) {
      setIsPaginating(false);
    }
  }, [loading]);

  return (
    <div className={styles.page}>
      <h2 className="panel-title text-4xl mb-8">♠ NASA IMAGE & VIDEO LIBRARY</h2>

      <div className={styles.mediaDashboardGrid}>
        <div className={styles.mediaMainPanel}>
          <Card className={styles.mediaMainCard}>
            {error && <ErrorMessage message={error} onRetry={handleRetry} />}

            {loading && !isPaginating && <SkeletonLoader count={4} height={250} />}

            {results.length > 0 && (!loading || isPaginating) && (
              <div>
                <h3 className={`panel-title ${styles.resultsTitle}`}>
                  ▸ {totalResults} RESULTS FOUND
                </h3>

                <div className={styles.mobileSearchPanel}>
                  <Card>
                    <h3 className="panel-title">SEARCH QUERY</h3>
                    <form onSubmit={handleSubmit} className={styles.searchForm}>
                      <div className={`form-field ${styles.formFieldSpacing}`}>
                        <label className="form-field label">ENTER KEYWORDS</label>
                        <input
                          type="text"
                          value={query}
                          onChange={handleQueryChange}
                          placeholder="e.g. Apollo, Saturn, Mars, Nebula"
                        />
                      </div>
                      <Button type="submit">
                        ▶ EXECUTE SEARCH
                      </Button>
                    </form>
                  </Card>
                </div>

                <div ref={mobileSelectedPanelRef} className={styles.mobileSelectedPanel}>
                  <Card>
                    <h3 className="panel-title">SELECTED MEDIA</h3>

                    {!selectedAsset && (
                      <div className={styles.mutedHint}>
                        ▸ Tap a gallery item to view specs and video preview
                      </div>
                    )}

                    {selectedAsset && (
                      <div className={styles.selectedAssetContent}>
                        <div className={styles.assetIdText}>
                          NASA ID: {selectedAsset}
                        </div>

                        <div className={styles.assetTitleText}>
                          {selectedItem?.title || 'Untitled'}
                        </div>

                        {embeddedMp4 ? (
                          <div className={styles.mediaPreviewWrap}>
                            {mobileReadyIdentity !== videoIdentity && (
                              <SixSquareLoader label="Loading video preview" />
                            )}

                            <video
                              key={videoIdentity}
                              controls
                              preload="metadata"
                              onLoadedData={() => setMobileReadyIdentity(videoIdentity)}
                              className={`${styles.mediaElement} ${
                                mobileReadyIdentity === videoIdentity ? styles.mediaVisible : ''
                              }`}
                            >
                              <source src={embeddedMp4.href} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        ) : (
                          <div className={styles.noEmbedMessage}>
                            ▸ No embeddable MP4 found for this item.
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                </div>

                {loading && isPaginating ? (
                  <div className={styles.galleryLoadingState} role="status" aria-live="polite" aria-label="Loading next page">
                    <div className={styles.gallerySpinner} aria-hidden="true" />
                  </div>
                ) : (
                  <>
                    <div className={styles.galleryGrid}>
                      {results.map((item) => (
                        <div
                          key={item.nasa_id}
                          className={styles.galleryItem}
                          data-nasa-id={item.nasa_id}
                          onClick={handleGalleryItemClick}
                          role="button"
                          tabIndex={0}
                        >
                          {item.thumbnail && <img src={item.thumbnail} alt={item.title} loading="lazy" />}
                          <div className={styles.galleryItemInfo}>
                            <div className={styles.galleryItemTitle}>
                              {item.title}
                            </div>
                            <div className={styles.galleryItemMeta}>
                              {item.center} — {item.media_type.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePaginationWithSpinner}
                    />
                  </>
                )}
              </div>
            )}

            {!loading && results.length === 0 && !error && (
              <LoadingState message="▸ NO MEDIA FOUND FOR QUERY" minHeight="200px" />
            )}
          </Card>
        </div>

        <aside className={styles.mediaSidePanel}>
          <Card className={styles.mediaSidePanelCard}>
            <h3 className="panel-title">SEARCH QUERY</h3>
            <form onSubmit={handleSubmit} className={styles.searchForm}>
              <div className={`form-field ${styles.formFieldSpacing}`}>
                <label className="form-field label">ENTER KEYWORDS</label>
                <input
                  type="text"
                  value={query}
                  onChange={handleQueryChange}
                  placeholder="e.g. Apollo, Saturn, Mars, Nebula"
                />
              </div>
              <Button type="submit">
                ▶ EXECUTE SEARCH
              </Button>
            </form>
          </Card>

          <Card className={styles.mediaSidePanelCard}>
            <h3 className="panel-title">ASSET DETAILS</h3>

            {!selectedAsset && (
              <div className={styles.mutedHint}>
                ▸ Select an item from the gallery to view details
              </div>
            )}

            {selectedAsset && (
              <div className={styles.selectedAssetContent}>
                <div className={styles.assetIdText}>
                  NASA ID: {selectedAsset}
                </div>

                <div className={styles.detailsScroll}>
                </div>
              </div>
            )}
          </Card>
        </aside>
      </div>

      {!isMobileViewport && isDesktopPreviewOpen && desktopPreviewMode && (
        <div
          className={styles.videoDialogOverlay}
          role="presentation"
          onClick={closeDesktopPreview}
        >
          <div
            className={styles.videoDialog}
            role="dialog"
            aria-modal="true"
            aria-label="NASA media preview"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.videoDialogHeader}>
              <h3 className="panel-title">{desktopPreviewMode === 'video' ? 'VIDEO PLAYER' : 'IMAGE PREVIEW'}</h3>
              <button
                type="button"
                className={styles.videoDialogClose}
                onClick={closeDesktopPreview}
              >
                ✕
              </button>
            </div>

            <div className={styles.dialogAssetTitle}>
              {selectedItem?.title || selectedAsset}
            </div>

            {desktopPreviewMode === 'loading' && (
              <SixSquareLoader label="Loading media preview" />
            )}

            {desktopPreviewMode === 'video' && embeddedMp4 && (
              <>
                <div className={styles.mediaPreviewOverlayWrap}>
                  {desktopReadyIdentity !== videoIdentity && (
                    <SixSquareLoader label="Loading video preview" />
                  )}

                  <video
                    key={videoIdentity}
                    controls
                    preload="metadata"
                    onLoadedData={() => setDesktopReadyIdentity(videoIdentity)}
                    className={`${styles.mediaElement} ${
                      desktopReadyIdentity === videoIdentity ? styles.mediaVisible : ''
                    }`}
                  >
                    <source src={embeddedMp4.href} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                <a
                  href={embeddedMp4.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.previewLink}
                >
                  ▶ Open MP4 in new tab
                </a>
              </>
            )}

            {desktopPreviewMode === 'image' && desktopPreviewImageHref && (
              <>
                <div className={styles.mediaPreviewOverlayWrap}>
                  {desktopImageReadyIdentity !== desktopImageIdentity && (
                    <SixSquareLoader label="Loading image preview" />
                  )}

                  <img
                    key={desktopImageIdentity}
                    src={desktopPreviewImageHref}
                    alt={selectedItem?.title || selectedAsset || 'NASA media preview'}
                    onLoad={() => setDesktopImageReadyIdentity(desktopImageIdentity)}
                    className={`${styles.imageElement} ${
                      desktopImageReadyIdentity === desktopImageIdentity ? styles.mediaVisible : ''
                    }`}
                  />
                </div>

                <a
                  href={desktopPreviewImageHref}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.previewLink}
                >
                  ▶ Open image in new tab
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NasaMediaPage;
