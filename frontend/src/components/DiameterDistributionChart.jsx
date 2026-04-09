import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styles from './styles/NeoChart.module.css';

const TICK_STYLE = {
  fill: 'rgba(216,220,226,0.6)',
  fontSize: 10,
  fontFamily: 'Courier New',
};

const TOOLTIP_STYLE = {
  background: 'rgba(8,12,27,0.96)',
  border: '1px solid rgba(255,179,71,0.35)',
  color: '#d8dce2',
  fontFamily: 'Courier New',
  fontSize: 11,
};

const LEGEND_STYLE = {
  fontSize: 10,
  fontFamily: 'Courier New',
  color: 'rgba(216,220,226,0.7)',
};

function DiameterDistributionChart({ series }) {
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <span className={styles.chartLabel}>DIAMETER DISTRIBUTION</span>
        <span className={styles.chartSub}>Size class breakdown by hazard status (7-day aggregate)</span>
      </div>
      <div className={styles.chartBody}>
        <ResponsiveContainer width="100%" height="100%">
        <BarChart data={series} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(216,220,226,0.08)" />
          <XAxis dataKey="bin" tick={TICK_STYLE} />
          <YAxis
            tick={TICK_STYLE}
            label={{
              value: 'COUNT',
              angle: -90,
              position: 'insideLeft',
              fill: 'rgba(216,220,226,0.35)',
              fontSize: 9,
              fontFamily: 'Courier New',
            }}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend wrapperStyle={LEGEND_STYLE} />
          <Bar
            dataKey="safe"
            name="Non-Hazardous"
            fill="rgba(0,255,255,0.4)"
            stroke="rgba(0,255,255,0.85)"
          />
          <Bar
            dataKey="hazardous"
            name="Hazardous"
            fill="rgba(255,97,115,0.5)"
            stroke="rgba(255,97,115,0.85)"
          />
        </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DiameterDistributionChart;
