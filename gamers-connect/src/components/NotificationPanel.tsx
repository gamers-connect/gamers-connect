"use client";

import React from 'react';

interface NotificationPanelProps {
  show: boolean;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '4rem',
      right: '1rem',
      width: '20rem',
      maxHeight: '24rem',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '0.75rem',
      padding: '1rem',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      zIndex: 50,
      color: '#1f2937'
    }}>
      <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>Notifications</h3>
      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
        No new notifications
      </div>
    </div>
  );
};

export default NotificationPanel;
