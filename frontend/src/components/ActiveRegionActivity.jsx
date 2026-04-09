import styles from './styles/ActiveRegionActivity.module.css';

function ActiveRegionActivity({ events }) {
  // Group events by active region number
  const regionMap = {};
  
  events.forEach((event) => {
    if (event.activeRegionNum) {
      const region = event.activeRegionNum.toString();
      if (!regionMap[region]) {
        regionMap[region] = {
          number: region,
          count: 0,
          events: [],
          maxClass: null,
        };
      }
      regionMap[region].count += 1;
      regionMap[region].events.push(event);
      
      // Track highest class
      const currentClass = event.classType;
      if (currentClass) {
        const currentRank = getClassRank(currentClass);
        const maxRank = getClassRank(regionMap[region].maxClass);
        if (currentRank > maxRank) {
          regionMap[region].maxClass = currentClass;
        }
      }
    }
  });

  const regions = Object.values(regionMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const maxCount = regions.length > 0 ? regions[0].count : 1;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <strong>ACTIVE REGION ACTIVITY</strong>
        <span className={styles.badge}>{regions.length} REGIONS</span>
      </div>

      <div className={styles.regionList}>
        {regions.length === 0 && (
          <div className={styles.noData}>NO ACTIVE REGION DATA</div>
        )}
        
        {regions.map((region) => {
          const widthPercent = (region.count / maxCount) * 100;
          
          return (
            <div key={region.number} className={styles.regionItem}>
              <div className={styles.regionLabel}>
                <span className={styles.regionNumber}>AR{region.number}</span>
                <span className={styles.regionCount}>{region.count}</span>
              </div>
              <div className={styles.regionBar}>
                <div 
                  className={styles.regionBarFill}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
              {region.maxClass && (
                <div className={styles.regionClass}>
                  MAX: {region.maxClass}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getClassRank(classType) {
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

export default ActiveRegionActivity;
