import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ApodPage from './pages/ApodPage';
import HomePage from './pages/HomePage';
import NasaMediaPage from './pages/NasaMediaPage';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app-container">
          <nav className="navbar">
            <div className="navbar-content">
              <h1 className="glow-text"><Link to="/" className="homepage_button">◈ NASA EXPLORER ◈</Link></h1>
              <ul className="nav-links">
                <li><Link to="/apod">APOD</Link></li>
                <li><Link to="/nasa-media">NASA MEDIA</Link></li>
              </ul>
            </div>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/apod" element={<ApodPage />} />
              <Route path="/nasa-media" element={<NasaMediaPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
