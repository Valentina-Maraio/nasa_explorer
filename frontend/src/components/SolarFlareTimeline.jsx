import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styles from './styles/SolarFlareTimeline.module.css';

function formatDate(isoString) {
  if (!isoString) return '';
  
  try {
    const date = new Date(isoString);
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${month}/${day}`;
  } catch {
    return isoString.split('T')[0];
  }
}

function formatTime(isoString) {
  if (!isoString) return '';
  
  try {
    const date = new Date(isoString);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return '';
  }
}

function getClassColor(classType) {
  if (!classType) return '#666';
  const firstChar = classType.charAt(0);
  
  switch (firstChar) {
    case 'X':
      return '#ff3333';
    case 'M':
      return '#ff9933';
    case 'C':
      return '#ffcc33';
    case 'B':
      return '#99cc33';
    case 'A':
      return '#66cc66';
    default:
      return '#666';
  }
}

function getClassIntensity(classType) {
  if (!classType) return 0;
  const firstChar = classType.charAt(0);
  
  switch (firstChar) {
    case 'X': return 5;
    case 'M': return 4;
    case 'C': return 3;
    case 'B': return 2;
    case 'A': return 1;
    default: return 0;
  }
}

function SolarFlareTimeline({ events }) {
  const displayEvents = events.slice(-10).reverse();
  
  const chartData = events.slice(-30).map((event) => ({
    timestamp: new Date(event.peakTime).getTime(),
    intensity: getClassIntensity(event.classType),
    classType: event.classType,
    color: getClassColor(event.classType),
    time: formatTime(event.peakTime),
    date: formatDate(event.peakTime),
    location: event.sourceLocation,
    region: event.activeRegionNum
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={styles.tooltipContainer}>
          <div className={styles.tooltipClass}>{data.classType}</div>
          <div className={styles.tooltipInfo}>
            {data.date} {data.time}Z
          </div>
          {data.location && <div className={styles.tooltipInfo}>{data.location}</div>}
          {data.region && <div className={styles.tooltipInfo}>AR{data.region}</div>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <strong>RECENT FLARE TIMELINE</strong>
        <span className={styles.badge}>{events.length} TOTAL</span>
      </div>

      {chartData.length > 0 && (
        <div className={styles.graphContainer}>
          <ResponsiveContainer width="100%" height={120}>
            <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <XAxis 
                dataKey="timestamp" 
                domain={['auto', 'auto']}
                type="number"
                tickFormatter={(timestamp) => {
                  const date = new Date(timestamp);
                  return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
                }}
                stroke="rgba(255, 255, 255, 0.3)"
                tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 9 }}
              />
              <YAxis 
                dataKey="intensity"
                domain={[0, 6]}
                ticks={[1, 2, 3, 4, 5]}
                tickFormatter={(value) => {
                  const labels = { 1: 'A', 2: 'B', 3: 'C', 4: 'M', 5: 'X' };
                  return labels[value] || '';
                }}
                stroke="rgba(255, 255, 255, 0.3)"
                tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 10, fontWeight: 600 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter data={chartData} fill="#8884d8">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className={styles.timeline}>
        {displayEvents.length === 0 && (
          <div className={styles.noData}>NO FLARE EVENTS IN RANGE</div>
        )}
        
        {displayEvents.map((event, index) => (
          <div key={event.flrID || index} className={styles.timelineItem}>
            <div 
              className={styles.timelineDot}
              style={{ backgroundColor: getClassColor(event.classType) }}
            />
            <div className={styles.timelineContent}>
              <div className={styles.eventHeader}>
                <span className={styles.eventClass}>{event.classType || 'UNKNOWN'}</span>
                <span className={styles.eventDate}>{formatDate(event.peakTime)}</span>
              </div>
              <div className={styles.eventDetails}>
                <span className={styles.eventTime}>
                  PEAK: {formatTime(event.peakTime)}Z
                </span>
                {event.sourceLocation && (
                  <span className={styles.eventLocation}>
                    {event.sourceLocation}
                  </span>
                )}
                {event.activeRegionNum && (
                  <span className={styles.eventRegion}>
                    AR{event.activeRegionNum}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SolarFlareTimeline;
