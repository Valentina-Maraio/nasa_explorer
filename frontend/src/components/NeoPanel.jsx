import { useMemo } from 'react';
import { ErrorMessage } from '../ui/ErrorMessage';
import { LoadingState } from '../ui/LoadingState';
import DailyVolumeChart from './DailyVolumeChart';
import DiameterDistributionChart from './DiameterDistributionChart';
import VelocityMissDistanceChart from './VelocityMissDistanceChart';
import RiskIndexChart from './RiskIndexChart';
import {
  buildDailyVolumeSeries,
  buildDiameterDistribution,
  buildRiskSeries,
  buildScatterSeries,
} from '../utils/transformNeoData';
import styles from './styles/NeoPanel.module.css';

function NeoPanel({ data, loading, error, retry }) {
  const dailyVolume = useMemo(() => buildDailyVolumeSeries(data), [data]);
  const diameterDist = useMemo(() => buildDiameterDistribution(data), [data]);
  const scatterSeries = useMemo(() => buildScatterSeries(data), [data]);
  const riskSeries = useMemo(() => buildRiskSeries(data), [data]);

  const totalObjects = useMemo(
    () => data.reduce((sum, day) => sum + day.objects.length, 0),
    [data],
  );

  return (
    <div className={`dashboard-panel ${styles.neoPanel}`}>
      <div className={styles.panelHeader}>
        <div className={styles.panelHeading}>NEO THREAT ANALYSIS</div>
        <div className={styles.feedBadges}>
          {!loading && !error && (
            <span className={styles.feedBadgeMuted}>{totalObjects} OBJECTS / 7 DAYS</span>
          )}
          <span className={styles.feedBadge}>NeoWs</span>
          <span className={styles.feedBadgeMuted}>NASA JPL</span>
        </div>
      </div>

      {error ? (
        <ErrorMessage message={error} onRetry={retry} />
      ) : loading ? (
        <LoadingState message="▸ SCANNING NEAR-EARTH OBJECTS..." minHeight="280px" />
      ) : (
        <div className={styles.chartsRegion}>
          <div className={styles.chartsGrid}>
            <DailyVolumeChart series={dailyVolume} />
            <DiameterDistributionChart series={diameterDist} />
            <VelocityMissDistanceChart series={scatterSeries} />
            <RiskIndexChart series={riskSeries} />
          </div>
        </div>
      )}
    </div>
  );
}

export default NeoPanel;
