import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Sparkles,
  ChartNoAxesCombined,
  Megaphone,
  Brain,
  Settings,
  X,
} from 'lucide-react';
import Logo from './Logo';

export default function Sidebar({ isOpen, onClose }) {
  // Navigation items strictly mapped per Phase 2.1 specifications
  const mainNavItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Leads', path: '/leads', icon: Users },
    { name: 'Predict', path: '/predict', icon: Sparkles },
    { name: 'Analytics', path: '/analytics', icon: ChartNoAxesCombined },
    { name: 'Campaign Intelligence', path: '/campaigns', icon: Megaphone },
    { name: 'Model Intelligence', path: '/models', icon: Brain },
  ];

  // Close drawer on Escape key for accessibility
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll on mobile when drawer is open
  useEffect(() => {
    if (isOpen && window.innerWidth <= 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavClick = () => {
    if (isOpen && window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Sidebar Element */}
      <aside
        className={`app-sidebar ${isOpen ? 'open' : ''}`}
        aria-label="Main Navigation"
        id="main-sidebar"
      >
        {/* Sidebar Header with Reusable Logo */}
        <div className="sidebar-header">
          <Logo />
          {/* Mobile drawer close button */}
          <button
            type="button"
            className="mobile-close-btn"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Primary Navigation */}
        <div className="sidebar-scrollable-area">
          <nav className="sidebar-nav" aria-label="Primary Suite Navigation">
            <div className="nav-section-label">Intelligence Suite</div>
            <ul className="nav-list">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path} className="nav-item">
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      className={({ isActive }) =>
                        `nav-link ${isActive ? 'active' : ''}`
                      }
                      onClick={handleNavClick}
                    >
                      <Icon size={18} className="nav-icon" aria-hidden="true" />
                      <span className="nav-label">{item.name}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Visual Divider between main navigation and settings */}
          <div
            className="sidebar-divider"
            role="separator"
            aria-orientation="horizontal"
          />

          {/* Bottom Settings Navigation */}
          <div className="sidebar-bottom-section">
            <div className="nav-section-label">Administration</div>
            <ul className="nav-list">
              <li className="nav-item">
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={handleNavClick}
                >
                  <Settings size={18} className="nav-icon" aria-hidden="true" />
                  <span className="nav-label">Settings</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Polished Sidebar Footer (System Metadata) */}
        <div className="sidebar-footer">
          <div className="system-status-indicator">
            <span className="status-indicator-dot" aria-hidden="true" />
            <span className="status-text">Glitchreach Core • Active</span>
          </div>
        </div>
      </aside>
    </>
  );
}
