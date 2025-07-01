
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ContentGeneratorPage from './pages/ContentGeneratorPage';
import SeoSuitePage from './pages/SeoSuitePage'; // Ensured relative path
import BrandConsistencyPage from './pages/BrandConsistencyPage';
import AudienceTargetingPage from './pages/AudienceTargetingPage';
// import CalendarAutomationPage from './pages/CalendarAutomationPage'; // Removed
import ApiKeyBanner from './components/ApiKeyBanner';
import { BRANDING_CONFIG } from './constants';

const App: React.FC = () => {
  // This is a placeholder for process.env.API_KEY.
  // In a real build setup, this would be replaced by the actual key or undefined.
  // For this environment, we'll simulate it being potentially undefined.
  const apiKey = typeof process !== 'undefined' && process.env && process.env.API_KEY ? process.env.API_KEY : undefined;


  return (
    <HashRouter>
      {!apiKey && <ApiKeyBanner />}
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/generator" element={<ContentGeneratorPage apiKey={apiKey} />} />
          <Route path="/seo" element={<SeoSuitePage apiKey={apiKey} />} />
          <Route path="/brand" element={<BrandConsistencyPage apiKey={apiKey} />} />
          <Route path="/audience" element={<AudienceTargetingPage apiKey={apiKey} />} />
          {/* <Route path="/calendar" element={<CalendarAutomationPage />} /> */} {/* Removed */}
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;