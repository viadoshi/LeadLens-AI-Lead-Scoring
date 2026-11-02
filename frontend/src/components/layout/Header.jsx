import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Header({ onMenuClick, isDrawerOpen }) {
  const location = useLocation();
  const { toggleTheme, isDark } = useTheme();

  // Helper function to resolve semantic breadcrumb & page title
  const getRouteContext = (pathname) => {
    if (pathname === '/') {
      return { title: 'Overview', section: 'Intelligence' };
    }
    if (pathname.startsWith('/leads/')) {
      const id = pathname.replace('/leads/', '');
      return { title: `Lead Details (#${id})`, section: 'Leads' };
    }
    if (pathname === '/leads') {
      return { title: 'Leads', section: 'Intelligence' };
    }
    if (pathname === '/predict') {
      return { title: 'Predict', section: 'Inference' };
    }
    if (pathname === '/analytics') {
      return { title: 'Analytics', section: 'Intelligence' };
    }
    if (pathname.startsWith('/campaigns/')) {
      const id = pathname.replace('/campaigns/', '');
      return { title: `Campaign Details (#${id})`, section: 'Campaigns' };
    }
    if (pathname === '/campaigns') {
      return { title: 'Campaign Intelligence', section: 'Campaigns' };
    }
    if (pathname === '/models') {
      return { title: 'Model Intelligence', section: 'Machine Learning' };
    }
    if (pathname === '/settings') {
      return { title: 'Settings', section: 'System' };
    }
    return { title: 'Dashboard', section: 'LeadLens' };
  };

  const { title, section } = getRouteContext(location.pathname);

  return (
    <header className="app-topbar" aria-label="Top Header">
      {/* Left side: Navigation Toggle (mobile) & Page Context */}
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          aria-expanded={isDrawerOpen}
          aria-controls="main-sidebar"
        >
          <Menu size={20} aria-hidden="true" />
        </button>

        <div className="topbar-context">
          <nav aria-label="Breadcrumbs" className="topbar-breadcrumb">
            <span className="breadcrumb-root">LeadLens</span>
            <span className="breadcrumb-separator" aria-hidden="true">/</span>
            <span className="breadcrumb-section">{section}</span>
            <span className="breadcrumb-separator" aria-hidden="true">/</span>
            <span className="breadcrumb-current" aria-current="page">{title}</span>
          </nav>
          <h1 className="topbar-mobile-title">{title}</h1>
        </div>
      </div>

      {/* Right side: Theme Toggle & User Profile Area */}
      <div className="topbar-right">
        {/* Theme Toggle Button */}
        <button
          type="button"
          className="theme-toggle-icon-btn"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <Sun size={18} className="theme-toggle-svg" aria-hidden="true" />
          ) : (
            <Moon size={18} className="theme-toggle-svg" aria-hidden="true" />
          )}
        </button>

        {/* User Profile Area (Non-functional UI Placeholder per Phase 2.1) */}
        <div
          className="user-profile-trigger"
          tabIndex={0}
          role="button"
          aria-label="User profile options: Alex Vance (RevOps Admin)"
        >
          <div className="user-avatar-badge" aria-hidden="true">
            <span className="avatar-initials">AV</span>
            <span className="avatar-status-dot" />
          </div>
          <div className="user-info-text">
            <span className="user-display-name">Alex Vance</span>
            <span className="user-role-label">RevOps Admin</span>
          </div>
          <ChevronDown size={14} className="user-chevron-icon" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}
