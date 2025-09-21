import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Questionnaire from './pages/Questionnaire';
import AIAnalysis from './pages/AIAnalysis';
import Roadmap from './pages/Roadmap';
import Chat from './pages/Chat';
import Quiz from './pages/Quiz';
import Career from './pages/Career';
import YouTubeTest from './components/YouTubeTest';
import DynamicRoadmap from './components/DynamicRoadmap';
import DynamicAnalytics from './components/DynamicAnalytics';
import NavigationHelper from './components/NavigationHelper';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1C1C1E',
              color: '#fff',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }
          }}
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/analysis" element={<AIAnalysis />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/career" element={<Career />} />
          <Route path="/youtube-test" element={<YouTubeTest />} />
          <Route path="/dynamic-roadmap" element={<DynamicRoadmap />} />
          <Route path="/dynamic-analytics" element={<DynamicAnalytics />} />
          <Route path="/navigation" element={<NavigationHelper />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
