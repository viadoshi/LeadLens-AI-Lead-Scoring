import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

/**
 * Reusable Application Layout Shell
 * Structure:
 * AppLayout
 * ├── Sidebar
 * └── Main (app-main-wrapper)
 *     ├── Header
 *     └── Content (app-content-area)
 */
export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="app-shell">
      {/* Sidebar (Desktop persistent / Mobile collapsible drawer) */}
      <Sidebar
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Main Area */}
      <div className="app-main-wrapper">
        {/* Top Header */}
        <Header
          onMenuClick={() => setMobileNavOpen(true)}
          isDrawerOpen={mobileNavOpen}
        />

        {/* Content Container */}
        <main className="app-content-area" id="main-content" tabIndex={-1}>
          <div className="content-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
