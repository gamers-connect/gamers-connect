"use client";

import React from 'react';
import { Gamepad2, Bell } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  games: string[];
  platforms: string[];
  playstyle: string;
  location: string;
  bio: string;
  discord: string;
  notifications: boolean;
  avatar: string;
}

interface NavigationProps {
  user: User | null;
  currentPage: string;
  onPageChange: (page: string) => void;
  onToggleNotifications: () => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  user, 
  currentPage, 
  onPageChange, 
  onToggleNotifications, 
  onLogout 
}) => {
  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-left">
            <div className="navbar-brand">
              <Gamepad2 className="brand-icon" />
              <h1 className="brand-title">Game Connect</h1>
            </div>
            
            <div className="navbar-nav">
              <button 
                onClick={() => onPageChange('dashboard')}
                className={`nav-link ${currentPage === 'dashboard' ? 'nav-link-active' : ''}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => onPageChange('players')}
                className={`nav-link ${currentPage === 'players' ? 'nav-link-active' : ''}`}
              >
                Find Players
              </button>
              <button 
                onClick={() => onPageChange('events')}
                className={`nav-link ${currentPage === 'events' ? 'nav-link-active' : ''}`}
              >
                Events
              </button>
            </div>
          </div>

          <div className="navbar-right">
            <button 
              onClick={onToggleNotifications}
              className="notification-btn"
            >
              <Bell className="notification-icon" />
              <span className="notification-badge">
                3
              </span>
            </button>
            
            <button 
              onClick={() => onPageChange('profile')}
              className="profile-btn"
            >
              <div className="profile-avatar">
                {user?.avatar}
              </div>
              <span className="profile-name">{user?.name}</span>
            </button>
            
            <button 
              onClick={onLogout}
              className="logout-btn"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
