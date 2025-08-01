"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from './Navigation';
import NotificationPanel from './NotificationPanel';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const handleLogout = async () => {
    setShowNotifications(false);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const isLandingPage = pathname === '/';

  if (isLandingPage) {
    return <>{children}</>;
  }

  if (!user) {
    return <>{children}</>; 
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #000000 100%)',
      minHeight: '100vh'
    }}>
      <Navigation
        user={user}
        currentPage={pathname.slice(1) || 'dashboard'}
        onToggleNotifications={handleToggleNotifications}
        onLogout={handleLogout}
      />
      <NotificationPanel show={showNotifications} onClose={() => setShowNotifications(false)} />
      {children}
    </div>
  );
};

export default LayoutWrapper;