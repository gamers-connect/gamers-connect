"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

interface Notification {
  id: string;
  type: 'player_match' | 'event' | 'session' | 'message' | 'achievement';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

interface NotificationPanelProps {
  show: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ show, onClose }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch notifications when panel is opened and user is available
  useEffect(() => {
    if (show && user) {
      const fetchNotifications = async () => {
        try {
          setLoading(true);
          setError('');
          const response = await api.notifications.getAll({ limit: 5 });
          // Fix: Ensure notifications is an array
          setNotifications(Array.isArray(response.notifications) ? response.notifications : []);
        } catch (err) {
          console.error('Failed to fetch notifications:', err);
          setError('Failed to load notifications.');
          setNotifications([]); // Ensure notifications is always an array
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
    }
  }, [show, user]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onClose]);

  const markAsRead = async (id: string) => {
    try {
      // Fix: Use the correct API method signature from your api.ts
      // The method is `markAsRead` and takes (notificationIds) or specific params
      await api.notifications.markAsRead([id]); // Pass as array
      
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Fix: Use the correct API method signature for marking all as read
      await api.notifications.markAsRead([], true); // Pass empty array and markAll flag
      
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      // Fix: Use the correct API method signature from your api.ts
      // The method is `delete` and takes specific params
      await api.notifications.delete(id); // Pass the ID directly
      
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  if (!show) return null;

  // Format relative time (simplified)
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div
      ref={panelRef}
      style={{
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
        color: '#1f2937',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.75rem'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>Notifications</h3>
        {notifications.filter(n => !n.isRead).length > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              fontSize: '0.75rem',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            Mark all read
          </button>
        )}
      </div>

      {error ? (
        <div style={{
          fontSize: '0.875rem',
          color: '#ef4444',
          padding: '0.5rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      ) : loading ? (
        <div style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          padding: '1rem',
          textAlign: 'center'
        }}>
          Loading...
        </div>
      ) : notifications.length === 0 ? (
        <div style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          padding: '1rem',
          textAlign: 'center'
        }}>
          No notifications yet
        </div>
      ) : (
        <div style={{
          overflowY: 'auto',
          flexGrow: 1
        }}>
          {notifications.map(notification => (
            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              style={{
                padding: '0.75rem',
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                backgroundColor: notification.isRead ? 'transparent' : 'rgba(59, 130, 246, 0.05)',
                cursor: 'pointer'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: notification.isRead ? 'normal' : '600',
                    margin: '0 0 0.25rem 0',
                    color: '#1f2937'
                  }}>
                    {notification.title}
                  </h4>
                  <p style={{
                    fontSize: '0.8125rem',
                    color: '#4b5563',
                    margin: '0 0 0.25rem 0'
                  }}>
                    {notification.message}
                  </p>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    margin: 0
                  }}>
                    {formatRelativeTime(notification.timestamp)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    padding: '0.125rem',
                    marginLeft: '0.5rem'
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
