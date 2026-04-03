function HomePage() {
  return (
    <div>
      <h2 className="panel-title text-4xl mb-8">▸ SYSTEM OVERVIEW</h2>
      
      <div className="dashboard-grid">
        <div className="large-panel dashboard-panel">
          <h3 className="panel-title">ASTRONOMICAL OBSERVATIONS</h3>
          <p style={{ lineHeight: '1.8', marginBottom: '20px' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '20px' }}>
            <div className="dashboard-panel">
              <h4 style={{ color: '#00ffff', marginBottom: '10px', fontSize: '1.2rem' }}>◈ APOD Module</h4>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                Access the Astronomy Picture of the Day with full temporal navigation and media type support.
              </p>
            </div>
            <div className="dashboard-panel">
              <h4 style={{ color: '#00ffff', marginBottom: '10px', fontSize: '1.2rem' }}>◈ MARS Module</h4>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                Browse high-resolution rover imagery with advanced filtering and metadata analysis.
              </p>
            </div>
          </div>
        </div>

        <div className="side-panel">
          <div className="dashboard-panel">
            <h3 className="panel-title">SYSTEM STATUS</h3>
            <div style={{ marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>NASA API</span>
                <span style={{ color: '#00ff9f' }}>■ ONLINE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Data Cache</span>
                <span style={{ color: '#00ff9f' }}>■ ACTIVE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Visualization</span>
                <span style={{ color: '#00ff9f' }}>■ READY</span>
              </div>
            </div>
          </div>

          <div className="dashboard-panel">
            <h3 className="panel-title">NAVIGATION</h3>
            <div style={{ display: 'grid', gap: '10px', marginTop: '15px' }}>
              <a href="/apod" style={{ padding: '10px', border: '1px solid #00ff9f', color: '#00ff9f', textDecoration: 'none', borderRadius: '2px', textAlign: 'center', transition: 'all 0.3s' }} 
                onMouseEnter={(e) => {e.target.style.background = 'rgba(0, 255, 159, 0.1)'; e.target.style.boxShadow = '0 0 15px rgba(0, 255, 159, 0.4)';}}
                onMouseLeave={(e) => {e.target.style.background = 'transparent'; e.target.style.boxShadow = 'none';}}
              >
                ▶ VIEW APOD
              </a>
              <a href="/mars" style={{ padding: '10px', border: '1px solid #00ff9f', color: '#00ff9f', textDecoration: 'none', borderRadius: '2px', textAlign: 'center', transition: 'all 0.3s' }}
                onMouseEnter={(e) => {e.target.style.background = 'rgba(0, 255, 159, 0.1)'; e.target.style.boxShadow = '0 0 15px rgba(0, 255, 159, 0.4)';}}
                onMouseLeave={(e) => {e.target.style.background = 'transparent'; e.target.style.boxShadow = 'none';}}
              >
                ▶ MARS EXPLORER
              </a>
            </div>
          </div>

          <div className="dashboard-panel">
            <h3 className="panel-title">INFO</h3>
            <div style={{ fontSize: '0.85rem', lineHeight: '1.8', color: 'rgba(0, 255, 159, 0.8)' }}>
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