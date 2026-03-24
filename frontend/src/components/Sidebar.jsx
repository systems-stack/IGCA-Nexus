import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Settings,
  FileText,
  Users,
  Contact,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import './Sidebar.css';
import logo from '../assets/igca logo.png';

const NavigationLinks = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/systems', label: 'Internal System', icon: Settings },
  { path: '/documents', label: 'Documents Format', icon: FileText },
  { path: '/hr', label: 'Human Resource', icon: Users },
  { path: '/directory', label: 'Member Directory', icon: Contact },
];

const Sidebar = ({ mobileOpen, onMobileClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-collapse on tablet
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024 && window.innerWidth > 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar on nav link click
  const handleNavClick = () => {
    if (onMobileClose) onMobileClose();
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={onMobileClose} />
      )}

      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          {(!isCollapsed || mobileOpen) && (
            <div className="brand">
              <img src={logo} alt="IGCA Logo" className="brand-logo-img" />
              <h2>IGCA NEXUS</h2>
            </div>
          )}
          {(isCollapsed && !mobileOpen) && (
            <img src={logo} alt="IGCA Logo" className="brand-logo-collapsed" />
          )}

          {/* Mobile close button */}
          <button className="mobile-close-btn" onClick={onMobileClose} aria-label="Close menu">
            <X size={20} />
          </button>

          {/* Desktop collapse toggle */}
          <button
            className="collapse-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {NavigationLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={handleNavClick}
            >
              <link.icon className="nav-icon" size={24} />
              {(!isCollapsed || mobileOpen) && <span className="nav-label">{link.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
