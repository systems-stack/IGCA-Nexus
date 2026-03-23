import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Settings,
  FileText,
  Users,
  Contact,
  ChevronLeft,
  ChevronRight
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

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="brand">
            <img src={logo} alt="IGCA Logo" className="brand-logo-img" />
            <h2>IGCA NEXUS</h2>
          </div>
        )}
        {isCollapsed && (
          <img src={logo} alt="IGCA Logo" className="brand-logo-collapsed" />
        )}
        <button
          className="collapse-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
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
          >
            <link.icon className="nav-icon" size={24} />
            {!isCollapsed && <span className="nav-label">{link.label}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
