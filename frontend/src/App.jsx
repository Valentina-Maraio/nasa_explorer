import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import AresCommandPage from './pages/ares/AresCommandPage';
import StarField from './components/StarField';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app-container">
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
