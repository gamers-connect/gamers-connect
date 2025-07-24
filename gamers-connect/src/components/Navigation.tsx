"use client";

import React from 'react';
import { Gamepad2, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  onToggleNotifications: () => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  user, 
  currentPage, 
  onToggleNotifications, 
  onLogout 
}) => {
  const router = useRouter();

  const handlePageChange = (page: string) => {
    router.push(`/${page}`);
  };

  if (!user) return null;

  return (
    <nav style={{ 
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '1rem 0'
    }}>
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Left side - Logo and Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Gamepad2 style={{ height: '2rem', width: '2rem', color: 'white' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Game Connect</h1>
          </div>
          
          {/* Navigation Links */}
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <button 
              onClick={() => handlePageChange('dashboard')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: currentPage === 'dashboard' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 'dashboard') {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 'dashboard') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              Dashboard
            </button>
            <button 
              onClick={() => handlePageChange('players')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: currentPage === 'players' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 'players') {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 'players') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              Find Players
            </button>
            <button 
              onClick={() => handlePageChange('events')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: currentPage === 'events' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 'events') {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 'events') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              Events
            </button>
          </div>
        </div>

        {/* Right side - User controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Notifications */}
          <button 
            onClick={onToggleNotifications}
            style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: 'transparent',
              color: 'white',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Bell style={{ height: '1.25rem', width: '1.25rem' }} />
            <span style={{
              position: 'absolute',
              top: '0.25rem',
              right: '0.25rem',
              backgroundColor: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              width: '1rem',
              height: '1rem',
              fontSize: '0.625rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              3
            </span>
          </button>
          
          {/* Profile Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              onClick={() => handlePageChange('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: currentPage === 'profile' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 'profile') {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 'profile') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <div style={{
                width: '2rem',
                height: '2rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem'
              }}>
                {user?.avatar}
              </div>
              <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{user?.name}</span>
            </button>
            
            {/* Logout */}
            <button 
              onClick={onLogout}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'transparent',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
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
