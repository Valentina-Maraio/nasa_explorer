import SpaceWeatherPanel from './SpaceWeatherPanel';
import styles from './styles/RightColumnBottom.module.css';

function RightColumnBottom({
  activeTab,
  selectedMediaItem,
  spaceWeather,
}) {
  if (activeTab === 'nasa-media') {
    return (
      <section className={`dashboard-panel ${styles.logPanel} ${styles.selectedMediaPanel}`}>
        <div className={styles.panelHeading}>SELECTED MEDIA</div>
        {selectedMediaItem ? (
          <div className={styles.mediaInspector}>
            <div className={styles.mediaInspectorHeader}>
              <strong>{selectedMediaItem.title}</strong>
              <span>{selectedMediaItem.center} · {selectedMediaItem.media_type.toUpperCase()}</span>
            </div>
            <p className={styles.mediaInspectorDescription}>
              {selectedMediaItem.description || 'No description available for this NASA media asset.'}
            </p>
          </div>
        ) : (
          <div></div>
        )}
      </section>
    );
  }

  if (activeTab === 'live') {
    return (
      <SpaceWeatherPanel
        mars={spaceWeather?.mars}
        moon={spaceWeather?.moon}
        marsLoading={spaceWeather?.marsLoading}
        moonLoading={spaceWeather?.moonLoading}
        marsError={spaceWeather?.marsError}
        moonError={spaceWeather?.moonError}
        marsFromFallback={spaceWeather?.marsFromFallback}
        moonFromFallback={spaceWeather?.moonFromFallback}
        retryMars={spaceWeather?.retryMars}
        retryMoon={spaceWeather?.retryMoon}
      />
    );
  }

  return null;
}

export default RightColumnBottom;
