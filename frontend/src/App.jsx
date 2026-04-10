import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './ui/ErrorBoundary';
import AresCommandPage from './pages/ares/AresCommandPage';
import RocketLoader from './ui/RocketLoader';
import StarField from './ui/StarField';
import './App.css';

const ROCKET_LOADER_SEEN_KEY = 'rocket_loader_seen';
const ROCKET_LOADER_DURATION_MS = 6400;

function App() {
  const [showRocketLoader, setShowRocketLoader] = useState(() => {
    try {
      return sessionStorage.getItem(ROCKET_LOADER_SEEN_KEY) !== '1';
    } catch {
      return true;
    }
  });
  const [isUiVisible, setIsUiVisible] = useState(() => !showRocketLoader);

  useEffect(() => {
    if (!showRocketLoader) {
      setIsUiVisible(true);
      return undefined;
    }

    setIsUiVisible(false);

    const hideTimeoutId = window.setTimeout(() => {
      setShowRocketLoader(false);
      setIsUiVisible(true);
      try {
        sessionStorage.setItem(ROCKET_LOADER_SEEN_KEY, '1');
      } catch {
      }
    }, ROCKET_LOADER_DURATION_MS);

    return () => {
      window.clearTimeout(hideTimeoutId);
    };
  }, [showRocketLoader]);

  return (
    <ErrorBoundary>
      <RocketLoader visible={showRocketLoader} />
      <Router>
        <div className={`app-container ${isUiVisible ? 'app-container--ready' : 'app-container--preload'}`}>
          <StarField />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<AresCommandPage initialTab="apod" />} />
              <Route path="/:tab" element={<AresCommandPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
