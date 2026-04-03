import { useState } from 'react';
import { useApod } from '../hooks/useApod';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

function ApodPage() {
  const { data: apod, loading, error, fetchApod } = useApod();
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchApod(selectedDate);
  };

  const handleRetry = () => {
    fetchApod(selectedDate);
  };

  return (
    <div>
      <h2 className="panel-title text-4xl mb-8">♠ ASTRONOMY PICTURE OF THE DAY ♠</h2>

      <div className="dashboard-grid">
        <div className="large-panel">
          {loading ? (
            <Card>
              <SkeletonLoader count={1} height={400} />
            </Card>
          ) : error ? (
            <Card>
              <ErrorMessage message={error} onRetry={handleRetry} className="mb-0" />
            </Card>
          ) : apod ? (
            <Card>
              <h3 className="panel-title text-2xl">{apod.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(0, 255, 159, 0.7)', marginBottom: '20px' }}>
                ▸ Captured: {apod.date}
              </p>

              {apod.media_type === 'image' ? (
                <img src={apod.url} alt={apod.title} style={{ width: '100%', margin: '20px 0' }} />
              ) : (
                <iframe
                  title="APOD Video"
                  src={apod.url}
                  style={{ width: '100%', height: '400px', marginBottom: '20px', border: '2px solid #00ff9f' }}
                />
              )}

              <div style={{ background: 'rgba(0, 255, 159, 0.05)', padding: '15px', border: '1px solid rgba(0, 255, 159, 0.3)', borderRadius: '2px', marginTop: '20px' }}>
                <p style={{ lineHeight: '1.8', fontSize: '0.95rem' }}>{apod.explanation}</p>
              </div>

              {apod.copyright && (
                <p style={{ marginTop: '15px', fontSize: '0.85rem', color: 'rgba(0, 255, 159, 0.6)' }}>
                  ◈ Copyright: {apod.copyright}
                </p>
              )}
            </Card>
          ) : null}
        </div>

        <div className="side-panel">
          <Card>
            <h3 className="panel-title">CONTROLS</h3>
            <form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#00ff9f', textShadow: '0 0 5px #00ff9f' }}>
                  SELECT DATE
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  max={new Date().toISOString().split('T')[0]}
                  style={{ width: '100%' }}
                />
              </div>
              <Button type="submit">▶ FETCH APOD</Button>
            </form>
          </Card>

          {apod && (
            <>
              <Card>
                <h3 className="panel-title">METADATA</h3>
                <div style={{ fontSize: '0.9rem', marginTop: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid rgba(0, 255, 159, 0.2)' }}>
                    <span>Type:</span>
                    <span style={{ color: '#00ffff' }}>{apod.media_type.toUpperCase()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid rgba(0, 255, 159, 0.2)' }}>
                    <span>Date:</span>
                    <span style={{ color: '#00ffff' }}>{apod.date}</span>
                  </div>
                  {apod.copyright && (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(0, 255, 159, 0.2)' }}>
                      <span style={{ fontSize: '0.8rem', color: 'rgba(0, 255, 159, 0.6)' }}>© {apod.copyright}</span>
                    </div>
                  )}
                </div>
              </Card>

              <Card>
                <h3 className="panel-title">AI SAYS ABOUT IT</h3>
                <div className="stats-container" style={{ display: 'grid', gap: '10px', marginTop: '15px' }}>
                  <div className="stat-box" style={{ gridColumn: 'auto' }}>
                    <div className="stat-box-label">TITLE LENGTH</div>
                    <div className="stat-box-value">{apod.title.length}</div>
                  </div>
                  <div className="stat-box" style={{ gridColumn: 'auto' }}>
                    <div className="stat-box-label">DESC LENGTH</div>
                    <div className="stat-box-value">{apod.explanation.length}</div>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApodPage;