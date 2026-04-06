import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {useApod} from '../../hooks/useApod';
import { useEpic } from '../../hooks/useEpic';
import { useImageSearch } from '../../hooks/useImageSearch';
import { useMarsManifest } from '../../hooks/useMarsManifest';
import { useNeo } from '../../hooks/useNeo';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import CommandHeader from '../../components/ares/CommandHeader';
import MediaReconPanel from '../../components/ares/panels/MediaReconPanel';
import LivePanel from '../../components/ares/panels/LivePanel';
import RightColumnBottom from '../../components/ares/panels/RightColumnBottom';
import TacticalOverrides from '../../components/ares/panels/TacticalOverrides';
import TelemetryColumn from '../../components/ares/panels/TelemetryColumn';
import VisualPanel from '../../components/ares/panels/VisualPanel';
import { TABS, getRouteForTab, resolveInitialTab } from '../config/tabs.js'
import { formatCountdown, formatNumber } from '../utils/formatters.js';
import styles from '../../style/pages/AresCommandPage.module.css';


function AresCommandPage({ initialTab = 'apod' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const today = new Date().toISOString().split('T')[0];
  const [activeTab, setActiveTab] = useState(resolveInitialTab(initialTab));
  const [hazardousOnly, setHazardousOnly] = useState(false);
  const [selectedApodDate, setSelectedApodDate] = useState(today);
  const [now, setNow] = useState(Date.now());

  const { data: apod, loading: apodLoading, error: apodError, fetchApod } = useApod(today);
  const { data: epic, loading: epicLoading, error: epicError, fetchEpic } = useEpic(today);
  const { data: neo, loading: neoLoading, error: neoError, fetchNeo } = useNeo(today);
  const {
    data: manifest,
    loading: marsLoading,
    error: marsError,
    fetchManifest,
  } = useMarsManifest('curiosity');
  const {
    query: mediaQuery,
    results: mediaResults,
    loading: mediaLoading,
    selectedAsset: selectedMediaAsset,
    assetFiles: mediaAssetFiles,
    error: mediaError,
    handleQueryChange: handleMediaQueryChange,
    handleSubmit: handleMediaSubmit,
    loadAsset: loadMediaAsset,
    searchMedia,
    currentPage: mediaCurrentPage,
    totalPages: mediaTotalPages,
    totalResults: mediaTotalResults,
    handlePageChange: handleMediaPageChange,
  } = useImageSearch('nebula', 6);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setActiveTab(resolveInitialTab(initialTab));
  }, [initialTab]);

  const setActiveTabAndRoute = (tabId) => {
    const nextTab = resolveInitialTab(tabId);
    const nextPath = getRouteForTab(nextTab);
    setActiveTab(nextTab);
    if (location.pathname !== nextPath) {
      navigate(nextPath);
    }
  };

  useEffect(() => {
    if (!selectedMediaAsset && mediaResults.length > 0) {
      loadMediaAsset(mediaResults[0].nasa_id);
    }
  }, [loadMediaAsset, mediaResults, selectedMediaAsset]);

  const missionLog = useMemo(() => {
    const objects = neo?.objects || [];
    return hazardousOnly ? objects.filter((item) => item.isPotentiallyHazardous) : objects;
  }, [hazardousOnly, neo]);

  const visibleMissionLog = useMemo(
    () => missionLog.slice(0, 6),
    [missionLog],
  );

  const primaryFeed = useMemo(() => {
    if (!apod) {
      return null;
    }

    return {
      type: apod.media_type,
      url: apod.url,
      title: apod.title,
      subtitle: apod.date,
    };
  }, [apod]);

  const selectedMediaItem = useMemo(
    () => mediaResults.find((item) => item.nasa_id === selectedMediaAsset) || null,
    [mediaResults, selectedMediaAsset],
  );

  const mediaPreviewImage = useMemo(() => {
    const imageFiles = mediaAssetFiles.filter((file) => /\.(jpe?g|png|webp|gif)($|\?)/i.test(file.href));
    return imageFiles.find((file) => !/~thumb/i.test(file.href)) || imageFiles[0] || null;
  }, [mediaAssetFiles]);

  const mediaPreviewVideo = useMemo(
    () => mediaAssetFiles.find((file) => /\.mp4($|\?)/i.test(file.href)) || null,
    [mediaAssetFiles],
  );

  const countdown = neo?.nextApproachTimestamp
    ? formatCountdown(neo.nextApproachTimestamp - now)
    : '00:00:00';

  const retryAll = () => {
    fetchApod(today);
    fetchEpic(today);
    fetchNeo(today);
    fetchManifest('curiosity');
  };

  const showGlobalError = !apod && !epic && !neo && !manifest && (apodError || epicError || neoError || marsError);

  const handleApodSubmit = (event) => {
    event.preventDefault();
    fetchApod(selectedApodDate);
  };

  const handleMediaSelect = (nasaId) => {
    loadMediaAsset(nasaId);
  };

  return (
    <div className={styles.page}>
      <CommandHeader tabs={TABS} activeTab={activeTab} onTabChange={setActiveTabAndRoute} />

      {showGlobalError ? <ErrorMessage message={apodError || epicError || neoError || marsError} onRetry={retryAll} /> : null}

      <div className={styles.commandGrid}>
        <TelemetryColumn
          countdown={countdown}
          neo={neo}
          neoLoading={neoLoading}
          manifest={manifest}
          marsLoading={marsLoading}
          formatNumber={formatNumber}
        />

        <section className={styles.centerColumn}>
          {activeTab === 'live'
            ? <LivePanel />
            : activeTab === 'nasa-media'
              ? (
                <MediaReconPanel
                  mediaQuery={mediaQuery}
                  mediaResults={mediaResults}
                  mediaLoading={mediaLoading}
                  selectedMediaAsset={selectedMediaAsset}
                  mediaError={mediaError}
                  handleMediaQueryChange={handleMediaQueryChange}
                  handleMediaSubmit={handleMediaSubmit}
                  handleMediaSelect={handleMediaSelect}
                  searchMedia={searchMedia}
                  mediaCurrentPage={mediaCurrentPage}
                  mediaTotalPages={mediaTotalPages}
                  mediaTotalResults={mediaTotalResults}
                  handleMediaPageChange={handleMediaPageChange}
                  formatNumber={formatNumber}
                />
              )
              : (
                <VisualPanel
                  activeTab={activeTab}
                  apod={apod}
                  apodLoading={apodLoading}
                  apodError={apodError}
                  epic={epic}
                  neo={neo}
                  manifest={manifest}
                  today={today}
                  primaryFeed={primaryFeed}
                  selectedApodDate={selectedApodDate}
                  setSelectedApodDate={setSelectedApodDate}
                  handleApodSubmit={handleApodSubmit}
                  fetchApod={fetchApod}
                  formatNumber={formatNumber}
                />
              )}
        </section>

        <aside className={styles.rightColumn}>
          <TacticalOverrides
            hazardousOnly={hazardousOnly}
            setHazardousOnly={setHazardousOnly}
            setActiveTabAndRoute={setActiveTabAndRoute}
          />

          <RightColumnBottom
            activeTab={activeTab}
            selectedMediaItem={selectedMediaItem}
            mediaPreviewVideo={mediaPreviewVideo}
            mediaPreviewImage={mediaPreviewImage}
            neoError={neoError}
            marsError={marsError}
            neoLoading={neoLoading}
            neo={neo}
            visibleMissionLog={visibleMissionLog}
            fetchNeo={fetchNeo}
            fetchManifest={fetchManifest}
            formatNumber={formatNumber}
            today={today}
          />
        </aside>
      </div>

      {apodError && apod ? <div className={styles.inlineWarning}>APOD warning: {apodError}</div> : null}
      {marsError && activeTab !== 'mars' ? <div className={styles.inlineWarning}>Mars warning: {marsError}</div> : null}
      {mediaError && activeTab !== 'nasa-media' ? <div className={styles.inlineWarning}>Media warning: {mediaError}</div> : null}
    </div>
  );
}

export default AresCommandPage;