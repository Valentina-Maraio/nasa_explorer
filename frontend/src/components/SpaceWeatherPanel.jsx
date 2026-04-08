import { useMemo, useState } from 'react';
import { LoadingState } from '../ui/LoadingState';
import styles from './styles/SpaceWeatherPanel.module.css';

function cToF(value) {
  if (value == null || Number.isNaN(value)) {
    return null;
  }

  return (value * (9 / 5)) + 32;
}

function msToMph(value) {
  if (value == null || Number.isNaN(value)) {
    return null;
  }

  return value * 2.236936;
}

function paToInHg(value) {
  if (value == null || Number.isNaN(value)) {
    return null;
  }

  return value * 0.0002953;
}

function formatValue(value, digits = 1) {
  if (value == null || Number.isNaN(value)) {
    return '--';
  }

  return Number(value).toFixed(digits);
}

function MarsCard({ units, data, loading, error, fromFallback, onRetry }) {
  if (loading && !data) {
    return <LoadingState message="▸ SYNCING MARS WEATHER..." minHeight="120px" />;
  }

  const latest = data?.latest;
  const tempUnit = units === 'imperial' ? 'F' : 'C';
  const pressureUnit = units === 'imperial' ? 'inHg' : 'Pa';
  const windUnit = units === 'imperial' ? 'mph' : 'm/s';

  const minTempBase = latest?.minTempC ?? latest?.avgTempC ?? null;
  const maxTempBase = latest?.maxTempC ?? latest?.avgTempC ?? null;
  const minTemp = units === 'imperial' ? cToF(minTempBase) : minTempBase;
  const maxTemp = units === 'imperial' ? cToF(maxTempBase) : maxTempBase;
  const pressure = units === 'imperial' ? paToInHg(latest?.pressurePa) : latest?.pressurePa;
  const wind = units === 'imperial' ? msToMph(latest?.windSpeedMs) : latest?.windSpeedMs;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <strong>MARS</strong>
        <span className={styles.status}>{data?.status === 'ok' ? 'NOMINAL' : 'UNAVAILABLE'}</span>
      </div>
      <div className={styles.readoutGrid}>
        <div><span>MIN TEMP</span><strong>{formatValue(minTemp)} {tempUnit}</strong></div>
        <div><span>MAX TEMP</span><strong>{formatValue(maxTemp)} {tempUnit}</strong></div>
        <div><span>PRESSURE</span><strong>{formatValue(pressure, units === 'imperial' ? 3 : 0)} {pressureUnit}</strong></div>
        <div><span>WIND</span><strong>{formatValue(wind, units === 'imperial' ? 1 : 2)} {windUnit}</strong></div>
      </div>
      <div className={styles.cardMeta}>SOL {latest?.sol || '--'} · {latest?.date || 'NO TIMESTAMP'}</div>
      {fromFallback ? <div className={styles.fallbackTag}>FALLBACK CACHE ACTIVE</div> : null}
      {error ? <div className={styles.errorLine}>MARS LINK DEGRADED · <button className={styles.retryButton} type="button" onClick={onRetry}>RETRY</button></div> : null}
      {data?.message ? <div className={styles.unavailable}>{data.message}</div> : null}
    </div>
  );
}

function MoonCard({ units, data, loading, error, fromFallback, onRetry }) {
  if (loading && !data) {
    return <LoadingState message="▸ SYNCING LUNAR PROXY..." minHeight="120px" />;
  }

  const proxyTemp = units === 'imperial' ? cToF(data?.proxyMetrics?.proxyTempC) : data?.proxyMetrics?.proxyTempC;
  const tempUnit = units === 'imperial' ? 'F (proxy)' : 'C (proxy)';

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <strong>MOON</strong>
        <span className={styles.status}>{data?.status === 'ok' ? 'PROXY ONLINE' : 'UNAVAILABLE'}</span>
      </div>
      <div className={styles.readoutGrid}>
        <div><span>PROXY TEMP</span><strong>{formatValue(proxyTemp)} {tempUnit}</strong></div>
        <div><span>LUNAR DIST</span><strong>{formatValue(data?.proxyMetrics?.lunarDistanceAu, 3)} AU</strong></div>
        <div><span>SOLAR DIST</span><strong>{formatValue(data?.proxyMetrics?.sunDistanceAu, 3)} AU</strong></div>
        <div><span>TIMESTAMP</span><strong>{data?.latest?.timestamp || '--'}</strong></div>
      </div>
      {fromFallback ? <div className={styles.fallbackTag}>FALLBACK CACHE ACTIVE</div> : null}
      {Array.isArray(data?.caveats) ? <div className={styles.caveat}>{data.caveats[0]}</div> : null}
      {error ? <div className={styles.errorLine}>LUNAR LINK DEGRADED · <button className={styles.retryButton} type="button" onClick={onRetry}>RETRY</button></div> : null}
      {data?.message ? <div className={styles.unavailable}>{data.message}</div> : null}
    </div>
  );
}

function SpaceWeatherPanel({
  mars,
  moon,
  marsLoading,
  moonLoading,
  marsError,
  moonError,
  marsFromFallback,
  moonFromFallback,
  retryMars,
  retryMoon,
}) {
  const [units, setUnits] = useState('metric');
  const unitLabel = useMemo(() => (units === 'metric' ? 'METRIC' : 'IMPERIAL'), [units]);

  return (
    <section className={`dashboard-panel ${styles.weatherPanel}`}>
      <div className={styles.panelHeader}>
        <div className={styles.panelHeading}>SPACE WEATHER</div>
        <button
          className={styles.unitsToggle}
          type="button"
          onClick={() => setUnits((prev) => (prev === 'metric' ? 'imperial' : 'metric'))}
        >
          {unitLabel}
        </button>
      </div>

      <div className={styles.cards}>
        <MarsCard
          units={units}
          data={mars}
          loading={marsLoading}
          error={marsError}
          fromFallback={marsFromFallback}
          onRetry={retryMars}
        />
        <MoonCard
          units={units}
          data={moon}
          loading={moonLoading}
          error={moonError}
          fromFallback={moonFromFallback}
          onRetry={retryMoon}
        />
      </div>
    </section>
  );
}

export default SpaceWeatherPanel;
