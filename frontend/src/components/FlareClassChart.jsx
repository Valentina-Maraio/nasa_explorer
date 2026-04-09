import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styles from './styles/FlareClassChart.module.css';

const CLASS_COLORS = {
  X: '#ff3333',
  M: '#ff9933',
  C: '#ffcc33',
  B: '#99cc33',
  A: '#66cc66'
};

function FlareClassChart({ summary }) {
  // Transform data for Recharts
  const chartData = ['X', 'M', 'C', 'B', 'A'].map((cls) => ({
    class: cls,
    count: summary.byClass[cls] || 0,
    color: CLASS_COLORS[cls]
  }));

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <strong>FLARE CLASS DISTRIBUTION</strong>
      </div>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart 
            data={chartData}
            margin={{ top: 20, right: 10, left: 10, bottom: 10 }}
          >
            <XAxis 
              dataKey="class" 
              stroke="rgba(255, 255, 255, 0.7)"
              tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12, fontWeight: 600 }}
            />
            <YAxis 
              stroke="rgba(255, 255, 255, 0.3)"
              tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                border: '1px solid rgba(216, 220, 226, 0.3)',
                borderRadius: '4px',
                fontSize: '12px'
              }}
              labelStyle={{ color: '#ffb347', fontWeight: 'bold' }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ backgroundColor: '#ff3333' }} />
          <span>X: Extreme</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ backgroundColor: '#ff9933' }} />
          <span>M: Major</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ backgroundColor: '#ffcc33' }} />
          <span>C: Common</span>
        </div>
      </div>
    </div>
  );
}

export default FlareClassChart;
