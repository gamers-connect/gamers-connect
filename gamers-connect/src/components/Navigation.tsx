"use client";

import React from 'react';
import { Gamepad2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import NotificationSystem from './NotificationSystem';
import StatusChip from './StatusChip';

interface User {
  id: string;
  name: string;
  email: string;
  games: string[];
  platforms: string[];
  playstyle?: string;
  location?: string;
  bio?: string;
  discord?: string;
  notifications?: boolean;
  avatar?: string;
}

interface NavigationProps {
  user: User | null;
  currentPage: string;
  onToggleNotifications: () => void;
  onLogout: () => void;
}

type Status = 'ONLINE' | 'AWAY' | 'OFFLINE';
const normalizeStatus = (s: Status | null): Status =>
  s === 'ONLINE' ? 'ONLINE'
    : s === 'AWAY' ? 'AWAY'
    : 'OFFLINE';

const Navigation: React.FC<NavigationProps> = ({
  user,
  currentPage,
  onLogout
}) => {
  const router = useRouter();
  const handlePageChange = (page: string) => {
    router.push(`/${page}`);
  };

  // Presence tracking (always uppercase)
  const [presence, setPresence] = React.useState<Status>('OFFLINE');

  React.useEffect(() => {
    // Load from localStorage
    try {
      const cached = localStorage.getItem('presence_status') as Status | null;
      setPresence(normalizeStatus(cached));
    } catch {}

    // In-tab updates
    const onPresence = (e: Event) => {
      const detail = (e as CustomEvent<Status>).detail ?? null;
      setPresence(normalizeStatus(detail));
    };
    window.addEventListener('presence-status', onPresence as EventListener);

    // Cross-tab updates
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'presence_status') {
        setPresence(normalizeStatus((e.newValue as Status | null) ?? null));
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('presence-status', onPresence as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

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
        {/* Left side nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Gamepad2 style={{ height: '2rem', width: '2rem', color: 'white' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Game Connect</h1>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['dashboard', 'players', 'events'].map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: currentPage === page ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {page === 'dashboard'
                  ? 'Dashboard'
                  : page === 'players'
                    ? 'Find Players'
                    : 'Events'}
              </button>
            ))}
          </div>
        </div>

        {/* Right side nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <NotificationSystem />

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
              <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                {user?.name}
              </span>
              <StatusChip status={presence} />
            </button>

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
