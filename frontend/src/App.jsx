import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './components/layout/AppLayout';

// Page components
import Overview from './pages/Overview';
import Leads from './pages/Leads';
import LeadDetails from './pages/LeadDetails';
import Predict from './pages/Predict';
import Analytics from './pages/Analytics';
import Campaigns from './pages/Campaigns';
import CampaignDetails from './pages/CampaignDetails';
import ModelIntelligence from './pages/ModelIntelligence';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Overview />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/:leadId" element={<LeadDetails />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:campaignId" element={<CampaignDetails />} />
            <Route path="/models" element={<ModelIntelligence />} />
            <Route path="/settings" element={<Settings />} />
            {/* Fallback to Overview */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
