"use client";

import React from 'react';

interface NotificationPanelProps {
  show: boolean;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed top-16 right-4 bg-white rounded-lg shadow-lg p-4 w-80 z-50 animate-fade-in">
      <h3 className="font-semibold mb-3">Notifications</h3>
      <div className="space-y-2 text-sm">
        <div className="p-2 bg-gray-50 rounded">New player match found!</div>
        <div className="p-2 bg-gray-100 rounded">Valorant tournament starts tomorrow</div>
        <div className="p-2 bg-gray-200 rounded">Your gaming session is starting soon</div>
      </div>
    </div>
  );
};

export default NotificationPanel;
