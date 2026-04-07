import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
import roverImage from '../../assets/rover.png';
import buttonImage from '../../assets/button_img.jpg';
import pressedButtonImage from '../../assets/pressed_btn.jpeg';

const ROVER_ENTER_DURATION_MS = 5200;
const BUTTON_ENTER_DURATION_MS = 4200;
const ENTER_PHASE_DURATION_MS = Math.max(ROVER_ENTER_DURATION_MS, BUTTON_ENTER_DURATION_MS);
const PRESS_DURATION_MS = 1300;
const POST_ARRIVAL_DELAY_MS = 2000;
const FLOAT_TRIGGER_DELAY_MS = 220;
const PRE_WARNING_DELAY_MS = 2000;
const WARNING_PHASE_MS = 1600;

function AresCommandPage({ initialTab = 'apod' }) {
  const roverRef = useRef(null);
  const buttonRef = useRef(null);
  const timeoutIdsRef = useRef([]);
  const rafIdsRef = useRef([]);
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
  const [animationLayout, setAnimationLayout] = useState({
    roverStartLeft: -320,
    roverFinalLeft: 40,
    roverPressLeft: 56,
    roverLeft: -320,
    roverBottom: 24,
    buttonLeft: 240,
    buttonStartBottom: -180,
    buttonFinalBottom: 24,
    buttonBottom: -180,
  });

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

  const clearSequenceTimers = useCallback(() => {
    timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutIdsRef.current = [];
    rafIdsRef.current.forEach((id) => window.cancelAnimationFrame(id));
    rafIdsRef.current = [];
  }, []);

  const calculateAnimationLayout = useCallback(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const roverRect = roverRef.current?.getBoundingClientRect();
    const buttonRect = buttonRef.current?.getBoundingClientRect();

    const roverWidth = Math.max(120, Math.round(roverRect?.width || 220));
    const buttonWidth = Math.max(110, Math.round(buttonRect?.width || 170));
    const buttonHeight = Math.max(70, Math.round(buttonRect?.height || 110));

    const sideMargin = 12;
    const desiredGap = 10;
    const targetCenterFromRight = viewportWidth / 3;
    let buttonLeft = Math.round(viewportWidth - targetCenterFromRight - buttonWidth / 2);
    buttonLeft = Math.max(sideMargin, Math.min(buttonLeft, viewportWidth - buttonWidth - sideMargin));

    let roverFinalLeft = buttonLeft - roverWidth - desiredGap;
    if (roverFinalLeft < sideMargin) {
      roverFinalLeft = sideMargin;
      buttonLeft = roverFinalLeft + roverWidth + desiredGap;
    }
    if (buttonLeft > viewportWidth - buttonWidth - sideMargin) {
      buttonLeft = viewportWidth - buttonWidth - sideMargin;
      roverFinalLeft = Math.max(sideMargin, buttonLeft - roverWidth - desiredGap);
    }

    const footerBandBottom = Math.max(18, Math.round(viewportHeight * 0.06));
    const buttonFinalBottom = footerBandBottom;
    const buttonStartBottom = -buttonHeight - 20;
    const roverBottom = buttonFinalBottom;
    const roverPressLeft = Math.round(buttonLeft + buttonWidth * 0.24 - roverWidth);

    const nextLayout = {
      roverStartLeft: -roverWidth - 24,
      roverFinalLeft,
      roverPressLeft,
      roverLeft: -roverWidth - 24,
      roverBottom,
      buttonLeft,
      buttonStartBottom,
      buttonFinalBottom,
      buttonBottom: buttonStartBottom,
    };

    return nextLayout;
  }, []);

  useEffect(() => {
    setAnimationLayout(calculateAnimationLayout());

    const onResize = () => {
      const nextLayout = calculateAnimationLayout();
      if (!motionVisible) {
        setAnimationLayout(nextLayout);
      }
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [calculateAnimationLayout, motionVisible]);

  const handleDangerTrigger = useCallback(() => {
    if (dangerLocked) {
      return;
    }

    clearSequenceTimers();
    const nextLayout = calculateAnimationLayout();
    setDangerLocked(true);
    setIsTriggeredFloating(false);
    setWarningVisible(false);
    setButtonPressed(false);
    setMotionVisible(false);
    setRoverTransitionMs(0);
    setButtonTransitionMs(0);
    setAnimationLayout(nextLayout);

    const warningDelayTimer = window.setTimeout(() => {
      setWarningVisible(true);

      const warningPhaseTimer = window.setTimeout(() => {
        setWarningVisible(false);
        setMotionVisible(true);

        const rafA = window.requestAnimationFrame(() => {
          const rafB = window.requestAnimationFrame(() => {
            setRoverTransitionMs(ROVER_ENTER_DURATION_MS);
            setButtonTransitionMs(BUTTON_ENTER_DURATION_MS);
            setAnimationLayout((layout) => ({
              ...layout,
              roverLeft: layout.roverFinalLeft,
              buttonBottom: layout.buttonFinalBottom,
            }));
          });
          rafIdsRef.current.push(rafB);
        });
        rafIdsRef.current.push(rafA);

        const pressTimer = window.setTimeout(() => {
          const delayTimer = window.setTimeout(() => {
            setRoverTransitionMs(PRESS_DURATION_MS);
            setAnimationLayout((layout) => ({
              ...layout,
              roverLeft: layout.roverPressLeft,
            }));

            const pressEndTimer = window.setTimeout(() => {
              setButtonPressed(true);
              const floatingStartTimer = window.setTimeout(() => {
                setIsTriggeredFloating(true);
                setWarningVisible(false);
                setMotionVisible(false);
                setButtonPressed(false);
                setRoverTransitionMs(0);
                setButtonTransitionMs(0);
              }, FLOAT_TRIGGER_DELAY_MS);
              timeoutIdsRef.current.push(floatingStartTimer);
            }, PRESS_DURATION_MS);
            timeoutIdsRef.current.push(pressEndTimer);
          }, POST_ARRIVAL_DELAY_MS);
          timeoutIdsRef.current.push(delayTimer);
        }, ENTER_PHASE_DURATION_MS);
        timeoutIdsRef.current.push(pressTimer);
      }, WARNING_PHASE_MS);
      timeoutIdsRef.current.push(warningPhaseTimer);
    }, PRE_WARNING_DELAY_MS);
    timeoutIdsRef.current.push(warningDelayTimer);
  }, [calculateAnimationLayout, clearSequenceTimers, dangerLocked]);

  useEffect(() => () => {
    clearSequenceTimers();
  }, [clearSequenceTimers]);

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
      <div className={`${styles.motionOverlay} ${motionVisible ? styles.motionOverlayVisible : styles.motionOverlayHidden}`} aria-hidden="true">
        <img
          ref={roverRef}
          className={`${styles.motionImage} ${styles.roverMotionImage}`}
          src={roverImage}
          alt=""
          onLoad={() => {
            const nextLayout = calculateAnimationLayout();
            setAnimationLayout((layout) => (
              motionVisible
                ? { ...nextLayout, roverLeft: layout.roverLeft, buttonBottom: layout.buttonBottom }
                : nextLayout
            ));
          }}
          style={{
            left: `${animationLayout.roverLeft}px`,
            bottom: `${animationLayout.roverBottom}px`,
            transitionDuration: `${roverTransitionMs}ms`,
          }}
        />
        <img
          ref={buttonRef}
          className={`${styles.motionImage} ${styles.buttonMotionImage}`}
          src={buttonPressed ? pressedButtonImage : buttonImage}
          alt=""
          onLoad={() => {
            const nextLayout = calculateAnimationLayout();
            setAnimationLayout((layout) => (
              motionVisible
                ? { ...nextLayout, roverLeft: layout.roverLeft, buttonBottom: layout.buttonBottom }
                : nextLayout
            ));
          }}
          style={{
            left: `${animationLayout.buttonLeft}px`,
            bottom: `${animationLayout.buttonBottom}px`,
            transitionDuration: `${buttonTransitionMs}ms`,
          }}
        />
      </div>

      {warningVisible ? <div className={styles.warningBanner}>WARNING</div> : null}

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
            isNasaMediaPage={activeTab === 'nasa-media'}
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