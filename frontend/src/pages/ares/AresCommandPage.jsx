import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEpic } from '../../hooks/useEpic.js';
import { useImageSearch } from '../../hooks/useImageSearch.js';
import { useSpaceWeather } from '../../hooks/useSpaceWeather.js';
import { ErrorMessage } from '../../ui/ErrorMessage.jsx';
import CommandHeader from '../../components/CommandHeader.jsx';
import MediaReconPanel from '../../components/MediaReconPanel.jsx';
import LivePanel from '../../components/LivePanel.jsx';
import RightColumnBottom from '../../components/RightColumnBottom.jsx';
import TacticalOverrides from '../../components/TacticalOverrides.jsx';
import TelemetryColumn from '../../components/TelemetryColumn.jsx';
import {
  MotionOverlay,
  WarningBanner,
  useAnimationLayout,
  useAnimationSequence,
  useTriggerAnimation,
} from '../../animation/index.js';
import { TABS, getRouteForTab, resolveInitialTab } from '../config/tabs.js'
import { formatNumber } from '../../utils/formatters.js';
import styles from './style/AresCommandPage.module.css';
import roverImage from '../../assets/cat_start.gif';
import roverStopImage from '../../assets/cat_stop.png';
import buttonImage from '../../assets/gravity_ON.png';
import pressedButtonImage from '../../assets/gravity_off.png';

function AresCommandPage({ initialTab = 'nasa-media' }) {
  const roverRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { tab } = useParams();
  const today = new Date().toISOString().split('T')[0];
  const resolvedTab = resolveInitialTab(tab || initialTab);
  const [activeTab, setActiveTab] = useState(resolvedTab);
  const [dangerLocked, setDangerLocked] = useState(false);
  const [isTriggeredFloating, setIsTriggeredFloating] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [motionVisible, setMotionVisible] = useState(false);
  const [roverTransitionMs, setRoverTransitionMs] = useState(0);
  const [buttonTransitionMs, setButtonTransitionMs] = useState(0);
  const [roverPaused, setRoverPaused] = useState(false);
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

  const { data: epic, loading: epicLoading, error: epicError, fetchEpic } = useEpic(today);
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
  const {
    mars: marsWeather,
    moon: moonWeather,
    marsLoading: marsWeatherLoading,
    moonLoading: moonWeatherLoading,
    marsError: marsWeatherError,
    moonError: moonWeatherError,
    marsFromFallback,
    moonFromFallback,
    retryMars,
    retryMoon,
  } = useSpaceWeather({
    active: activeTab === 'live',
    date: today,
  });

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
    setRoverPaused,
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

  const retryAll = () => {
    fetchEpic(today);
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
          roverImage={roverPaused ? roverStopImage : roverImage}
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

      <div className={styles.commandGrid}>
        <TelemetryColumn
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
                    mediaAssetFiles={mediaAssetFiles}
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
                : ''}
        </section>

        <aside className={styles.rightColumn}>
          <TacticalOverrides
            setActiveTabAndRoute={setActiveTabAndRoute}
            onDangerTrigger={handleDangerTrigger}
            dangerDisabled={dangerLocked}
            isNasaMediaPage={activeTab === 'nasa-media' || activeTab === 'live'}
          />

          <RightColumnBottom
            activeTab={activeTab}
            selectedMediaItem={selectedMediaItem}
            mediaPreviewVideo={mediaPreviewVideo}
            mediaPreviewImage={mediaPreviewImage}
            formatNumber={formatNumber}
            today={today}
            spaceWeather={{
              mars: marsWeather,
              moon: moonWeather,
              marsLoading: marsWeatherLoading,
              moonLoading: moonWeatherLoading,
              marsError: marsWeatherError,
              moonError: moonWeatherError,
              marsFromFallback,
              moonFromFallback,
              retryMars,
              retryMoon,
            }}
          />
        </aside>
      </div>

      <div className={styles.inlineWarning}>Per Aspera Ad Astra</div>
    </div>
  );
}

export default AresCommandPage;