import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {useApod} from '../../hooks/useApod.js';
import { useEpic } from '../../hooks/useEpic.js';
import { useImageSearch } from '../../hooks/useImageSearch.js';
import { useMarsManifest } from '../../hooks/useMarsManifest.js';
import { useNeo } from '../../hooks/useNeo.js';
import { ErrorMessage } from '../../ui/ErrorMessage.jsx';
import CommandHeader from '../../components/CommandHeader.jsx';
import MediaReconPanel from '../../components/MediaReconPanel.jsx';
import LivePanel from '../../components/LivePanel.jsx';
import RightColumnBottom from '../../components/RightColumnBottom.jsx';
import TacticalOverrides from '../../components/TacticalOverrides.jsx';
import TelemetryColumn from '../../components/TelemetryColumn.jsx';
import VisualPanel from '../../components/VisualPanel.jsx';
import {
  MotionOverlay,
  WarningBanner,
  useAnimationLayout,
  useAnimationSequence,
  useTriggerAnimation,
} from '../../animation/index.js';
import { TABS, getRouteForTab, resolveInitialTab } from '../config/tabs.js'
import { formatCountdown, formatNumber } from '../utils/formatters.js';
import styles from './style/AresCommandPage.module.css';
import roverImage from '../../assets/rover.png';
import buttonImage from '../../assets/button_img.jpg';
import pressedButtonImage from '../../assets/pressed_btn.jpeg';

function AresCommandPage({ initialTab = 'apod' }) {
  const roverRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { tab } = useParams();
  const today = new Date().toISOString().split('T')[0];
  const resolvedTab = resolveInitialTab(tab || initialTab);
  const [activeTab, setActiveTab] = useState(resolvedTab);
  const [selectedApodDate, setSelectedApodDate] = useState(today);
  const [now, setNow] = useState(Date.now());
  const [dangerLocked, setDangerLocked] = useState(false);
  const [isTriggeredFloating, setIsTriggeredFloating] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [motionVisible, setMotionVisible] = useState(false);
  const [roverTransitionMs, setRoverTransitionMs] = useState(0);
  const [buttonTransitionMs, setButtonTransitionMs] = useState(0);
  const {
    timeoutIdsRef,
    rafIdsRef,
    clearSequenceTimers,
  } = useAnimationSequence();
  const {
    animationLayout,
    setAnimationLayout,
    calculateAnimationLayout,
  } = useAnimationLayout({ roverRef, buttonRef, motionVisible });

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
    setActiveTab(resolveInitialTab(tab || initialTab));
  }, [initialTab, tab]);

  const { handleDangerTrigger } = useTriggerAnimation({
    dangerLocked,
    setDangerLocked,
    setIsTriggeredFloating,
    setWarningVisible,
    setButtonPressed,
    setMotionVisible,
    setRoverTransitionMs,
    setButtonTransitionMs,
    setAnimationLayout,
    calculateAnimationLayout,
    clearSequenceTimers,
    timeoutIdsRef,
    rafIdsRef,
  });

  const handleMotionAssetLoad = useCallback(() => {
    const nextLayout = calculateAnimationLayout();
    setAnimationLayout((layout) => (
      motionVisible
        ? { ...nextLayout, roverLeft: layout.roverLeft, buttonBottom: layout.buttonBottom }
        : nextLayout
    ));
  }, [calculateAnimationLayout, motionVisible, setAnimationLayout]);

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

  const missionLog = useMemo(() => neo?.objects || [], [neo]);

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

  const handleGravityRestore = useCallback(() => {
    setIsTriggeredFloating(false);
    setDangerLocked(false);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('global-triggered-floating', isTriggeredFloating);
    return () => {
      document.body.classList.remove('global-triggered-floating');
    };
  }, [isTriggeredFloating]);

  return (
    <div className={styles.page}>
      <MotionOverlay
        motionVisible={motionVisible}
        roverRef={roverRef}
        buttonRef={buttonRef}
        roverImage={roverImage}
        buttonImage={buttonImage}
        pressedButtonImage={pressedButtonImage}
        buttonPressed={buttonPressed}
        onRoverLoad={handleMotionAssetLoad}
        onButtonLoad={handleMotionAssetLoad}
        animationLayout={animationLayout}
        roverTransitionMs={roverTransitionMs}
        buttonTransitionMs={buttonTransitionMs}
      />

      <WarningBanner visible={warningVisible} />

      <CommandHeader
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTabAndRoute}
        gravityEnabled={isTriggeredFloating}
        onGravityRestore={handleGravityRestore}
      />

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
                  fetchApod={fetchApod}
                  formatNumber={formatNumber}
                />
              )}
        </section>

        <aside className={styles.rightColumn}>
          <TacticalOverrides
            setActiveTabAndRoute={setActiveTabAndRoute}
            onDangerTrigger={handleDangerTrigger}
            dangerDisabled={dangerLocked}
            selectedApodDate={selectedApodDate}
            setSelectedApodDate={setSelectedApodDate}
            handleApodSubmit={handleApodSubmit}
            apodLoading={apodLoading}
            today={today}
            isNasaMediaPage={activeTab === 'nasa-media' || activeTab === 'live'}
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