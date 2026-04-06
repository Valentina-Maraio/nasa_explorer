import React from 'react';
import styles from './styles/HomePage.module.css';

function HomePage() {
  return (
    <div>
      <h2 className="panel-title text-4xl mb-8">▸ SYSTEM OVERVIEW</h2>
      
      <div className="dashboard-grid">
        <div className="large-panel dashboard-panel">
          <h3 className="panel-title">ASTRONOMICAL OBSERVATIONS</h3>
          <p className={styles.overviewText}>
            Welcome to the NASA Data Explorer—a comprehensive system for monitoring and analyzing astronomical phenomena. 
            This interface provides real-time access to NASA's most significant data streams.
          </p>
          
          <div className="stats-container">
            <div className="stat-box">
              <div className="stat-box-label">APOD STATUS</div>
              <div className="stat-box-value">ACTIVE</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-label">MARS ROVERS</div>
              <div className="stat-box-value">3</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-label">SATELLITES</div>
              <div className="stat-box-value">∞</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-label">UPTIME</div>
              <div className="stat-box-value">100%</div>
            </div>
          </div>

          <h3 className="panel-title mt-8">AVAILABLE MODULES</h3>
          <div className={styles.modulesGrid}>
            <div className={`dashboard-panel ${styles.moduleCard}`}>
              <h4 className={styles.moduleTitle}>◈ APOD Module</h4>
              <p className={styles.moduleDescription}>
                Access the Astronomy Picture of the Day with full temporal navigation and media type support.
              </p>
            </div>
            <div className={`dashboard-panel ${styles.moduleCard}`}>
              <h4 className={styles.moduleTitle}>◈ MARS Module</h4>
              <p className={styles.moduleDescription}>
                Browse high-resolution rover imagery with advanced filtering and metadata analysis.
              </p>
            </div>
          </div>
        </div>

        <div className="side-panel">
          <div className="dashboard-panel">
            <h3 className="panel-title">SYSTEM STATUS</h3>
            <div className={styles.statusList}>
              <div className={styles.statusRow}>
                <span>NASA API</span>
                <span className={styles.onlineValue}>■ ONLINE</span>
              </div>
              <div className={styles.statusRow}>
                <span>Data Cache</span>
                <span className={styles.onlineValue}>■ ACTIVE</span>
              </div>
              <div className={styles.statusRow}>
                <span>Visualization</span>
                <span className={styles.onlineValue}>■ READY</span>
              </div>
            </div>
          </div>

          <div className="dashboard-panel">
            <h3 className="panel-title">NAVIGATION</h3>
            <div className={styles.navGrid}>
              <a href="/apod" className={styles.navLink}>
                ▶ VIEW APOD
              </a>
              <a href="/mars" className={styles.navLink}>
                ▶ MARS EXPLORER
              </a>
            </div>
          </div>

          <div className="dashboard-panel">
            <h3 className="panel-title">INFO</h3>
            <div className={styles.infoText}>
              <p>Data Source: NASA Open APIs</p>
              <p>Version: 1.0.0</p>
              <p>Status: OPERATIONAL</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;