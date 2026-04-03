import { useRef, useState } from 'react';
import { useImageSearch } from '../hooks/useImageSearch';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { Pagination } from '../components/ui/Pagination';
import robotMakingVideo from '../assets/robot_making_video.png';

function NasaMediaPage() {
  const mobileSelectedPanelRef = useRef(null);
  const [mobileReadyIdentity, setMobileReadyIdentity] = useState('');
  const [desktopReadyIdentity, setDesktopReadyIdentity] = useState('');

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

  const handleRetry = () => {
    searchMedia(query);
  };

  const selectedItem = results.find((item) => item.nasa_id === selectedAsset);
  const embeddedMp4 = assetFiles.find((file) => /\.mp4($|\?)/i.test(file.href));
  const videoIdentity = embeddedMp4 ? `${selectedAsset}-${embeddedMp4.href}` : '';

  const isMobileViewport = () => window.matchMedia('(max-width: 1000px)').matches;

  const handleSelectAsset = (nasaId) => {
    loadAsset(nasaId);

    if (isMobileViewport() && mobileSelectedPanelRef.current) {
      requestAnimationFrame(() => {
        mobileSelectedPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  return (
    <div>
      <h2 className="panel-title text-4xl mb-8">♠ NASA IMAGE & VIDEO LIBRARY</h2>

      <div className="dashboard-grid">
        {/* main panel */}
        <div className="large-panel">
          <Card>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
              <div className="form-field">
                <label className="form-field label">SEARCH QUERY</label>
                <input
                  type="text"
                  value={query}
                  onChange={handleQueryChange}
                  placeholder="e.g. Apollo, Saturn, Mars, Nebula"
                />
              </div>
              <Button type="submit">
                {loading ? '▸ SCANNING NASA ARCHIVES...' : '▶ EXECUTE SEARCH'}
              </Button>
            </form>

            {error && <ErrorMessage message={error} onRetry={handleRetry} />}

            {loading && <SkeletonLoader count={4} height={250} />}

            {!loading && results.length > 0 && (
              <div>
                <h3 className="panel-title" style={{ marginBottom: '20px' }}>
                  ▸ {totalResults} RESULTS FOUND
                </h3>

                <div ref={mobileSelectedPanelRef} className="nasa-mobile-selected-panel">
                  <Card>
                    <h3 className="panel-title">SELECTED MEDIA</h3>

                    {!selectedAsset && (
                      <div style={{ marginTop: '15px', color: 'rgba(0,255,159,0.6)' }}>
                        ▸ Tap a gallery item to view specs and video preview
                      </div>
                    )}

                    {selectedAsset && (
                      <div style={{ marginTop: '15px' }}>
                        <div style={{ color: '#00ffff', fontWeight: 'bold', marginBottom: '10px' }}>
                          NASA ID: {selectedAsset}
                        </div>

                        <div style={{ fontSize: '0.9rem', color: 'rgba(0,255,159,0.8)', marginBottom: '12px' }}>
                          {selectedItem?.title || 'Untitled'}
                        </div>

                        <div style={{ maxHeight: '160px', overflowY: 'auto', fontSize: '0.85rem' }}>
                          {assetFiles.slice(0, 6).map((file, idx) => (
                            <div key={idx} style={{ marginBottom: '8px', color: 'rgba(0,255,159,0.7)' }}>
                              <a href={file.href} target="_blank" rel="noreferrer" style={{ color: '#00ffff' }}>
                                {file.href.split('/').pop()}
                              </a>
                            </div>
                          ))}
                        </div>

                        {embeddedMp4 ? (
                          <div style={{ position: 'relative', marginTop: '12px' }}>
                            {mobileReadyIdentity !== videoIdentity && (
                              <img
                                src={robotMakingVideo}
                                alt="Video loading"
                                style={{
                                  width: '100%',
                                  border: '1px solid rgba(0, 255, 159, 0.3)',
                                  borderRadius: '2px',
                                }}
                              />
                            )}

                            <video
                              key={videoIdentity}
                              controls
                              preload="metadata"
                              onLoadedData={() => setMobileReadyIdentity(videoIdentity)}
                              style={{
                                width: '100%',
                                border: '1px solid rgba(0, 255, 159, 0.3)',
                                borderRadius: '2px',
                                display: 'block',
                                opacity: mobileReadyIdentity === videoIdentity ? 1 : 0,
                                transition: 'opacity 0.25s ease',
                              }}
                            >
                              <source src={embeddedMp4.href} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        ) : (
                          <div style={{ marginTop: '12px', color: 'rgba(0,255,159,0.6)', fontSize: '0.85rem' }}>
                            ▸ No embeddable MP4 found for this item.
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                </div>

                <div className="gallery-grid">
                  {results.map((item) => (
                    <div
                      key={item.nasa_id}
                      className="gallery-item"
                      onClick={() => handleSelectAsset(item.nasa_id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {item.thumbnail && <img src={item.thumbnail} alt={item.title} />}
                      <div className="gallery-item-info">
                        <div
                          style={{
                            color: '#00ffff',
                            fontWeight: 'bold',
                            marginBottom: '5px',
                          }}
                        >
                          {item.title}
                        </div>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            color: 'rgba(0, 255, 159, 0.7)',
                          }}
                        >
                          {item.center} — {item.media_type.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {!loading && results.length === 0 && !error && (
              <LoadingState message="▸ NO MEDIA FOUND FOR QUERY" minHeight="200px" />
            )}
          </Card>
        </div>

        {/* side panel */}
        <div className="side-panel nasa-media-side-panel">
          <Card>
            <h3 className="panel-title">ASSET DETAILS</h3>

            {!selectedAsset && (
              <div style={{ marginTop: '15px', color: 'rgba(0,255,159,0.6)' }}>
                ▸ Select an item from the gallery to view details
              </div>
            )}

            {selectedAsset && (
              <div style={{ marginTop: '15px' }}>
                <div
                  style={{
                    color: '#00ffff',
                    fontWeight: 'bold',
                    marginBottom: '10px',
                  }}
                >
                  NASA ID: {selectedAsset}
                </div>

                <div
                  style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    fontSize: '0.85rem',
                  }}
                >
                </div>
              </div>
            )}
          </Card>

          <Card>
            <h3 className="panel-title">VIDEO PLAYER</h3>

            {!selectedAsset && (
              <div style={{ marginTop: '15px', color: 'rgba(0,255,159,0.6)' }}>
                ▸ Select a gallery item to preview video when an MP4 file exists
              </div>
            )}

            {selectedAsset && !embeddedMp4 && (
              <div style={{ marginTop: '15px', color: 'rgba(0,255,159,0.7)' }}>
                ▸ No embeddable MP4 found for this asset.
                <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'rgba(0,255,159,0.55)' }}>
                  Try another result with media type VIDEO.
                </div>
              </div>
            )}

            {selectedAsset && embeddedMp4 && (
              <div style={{ marginTop: '15px' }}>
                <div style={{ marginBottom: '10px', color: '#00ffff', fontWeight: 'bold' }}>
                  {selectedItem?.title || selectedAsset}
                </div>

                <div style={{ position: 'relative' }}>
                  {desktopReadyIdentity !== videoIdentity && (
                    <img
                      src={robotMakingVideo}
                      alt="Video loading"
                      style={{
                        width: '100%',
                        border: '1px solid rgba(0, 255, 159, 0.3)',
                        borderRadius: '2px',
                      }}
                    />
                  )}

                  <video
                    key={videoIdentity}
                    controls
                    preload="metadata"
                    onLoadedData={() => setDesktopReadyIdentity(videoIdentity)}
                    style={{
                      width: '100%',
                      border: '1px solid rgba(0, 255, 159, 0.3)',
                      borderRadius: '2px',
                      display: 'block',
                      opacity: desktopReadyIdentity === videoIdentity ? 1 : 0,
                      transition: 'opacity 0.25s ease',
                    }}
                  >
                    <source src={embeddedMp4.href} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                <a
                  href={embeddedMp4.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-block',
                    marginTop: '10px',
                    color: '#00ffff',
                    fontSize: '0.85rem',
                  }}
                >
                  ▶ Open MP4 in new tab
                </a>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default NasaMediaPage;
