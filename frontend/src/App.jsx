import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import AresCommandPage from './pages/ares/AresCommandPage';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app-container">
          <main className="main-content">
            <Routes>
              <Route path="/" element={<AresCommandPage initialTab="apod" />} />
              <Route path="/command" element={<AresCommandPage initialTab="apod" />} />
              <Route path="/apod" element={<AresCommandPage initialTab="apod" />} />
              <Route path="/nasa-media" element={<AresCommandPage initialTab="nasa-media" />} />
              <Route path="/neo" element={<AresCommandPage initialTab="neo" />} />
              <Route path="/mars" element={<AresCommandPage initialTab="mars" />} />
              <Route path="/live" element={<AresCommandPage initialTab="live" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
