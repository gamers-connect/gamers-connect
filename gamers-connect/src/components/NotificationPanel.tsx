"use client";

import React from 'react';

interface NotificationPanelProps {
  show: boolean;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="notification-panel">
      <h3 className="notification-title">Notifications</h3>
      <div className="notification-list">
        <div className="notification-item notification-item-new">New player match found!</div>
        <div className="notification-item notification-item-recent">Valorant tournament starts tomorrow</div>
        <div className="notification-item notification-item-old">Your gaming session is starting soon</div>
      </div>
    </div>
  );
};

export default NotificationPanel;
