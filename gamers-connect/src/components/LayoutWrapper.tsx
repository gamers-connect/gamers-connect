"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import NotificationPanel from './NotificationPanel';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const handleLogout = () => {
    setShowNotifications(false);
    window.location.href = '/'; // Redirect to home
  };

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const isLandingPage = pathname === '/';

  // If it's the landing page, just return children without navigation
  if (isLandingPage) {
    return <>{children}</>;
  }

  // Mock user for authenticated pages
  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@hawaii.edu',
    games: ['Valorant', 'Overwatch 2', 'Apex Legends'],
    platforms: ['PC'],
    playstyle: 'Competitive',
    location: 'UH Mānoa Campus',
    bio: 'Looking for teammates to climb ranked! Available most evenings.',
    discord: 'JohnDoe#1234',
    notifications: true,
    avatar: '🎮'
  };

  // For authenticated pages, wrap with navigation and background
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #000000 100%)',
      minHeight: '100vh'
    }}>
      <Navigation
        user={mockUser}
        currentPage={pathname.slice(1) || 'dashboard'}
        onToggleNotifications={handleToggleNotifications}
        onLogout={handleLogout}
      />
      <NotificationPanel show={showNotifications} />
      {children}
    </div>
  );
};

export default LayoutWrapper;
