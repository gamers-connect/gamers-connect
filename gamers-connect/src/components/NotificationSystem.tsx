"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Settings, Users, Calendar, MessageCircle, Trophy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

interface Notification {
  id: string; // Changed to string to match potential API ID type
  type: 'player_match' | 'event' | 'session' | 'message' | 'achievement';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

interface NotificationSettings {
  playerMatches: boolean;
  newEvents: boolean;
  sessionInvites: boolean;
  messages: boolean;
  achievements: boolean;
  emailNotifications: boolean;
}

const NotificationSystem: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    playerMatches: true,
    newEvents: true,
    sessionInvites: true,
    messages: true,
    achievements: true,
    emailNotifications: false
  });
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await api.notifications.getAll();
        const fetchedNotifications = Array.isArray(response.notifications) ? response.notifications : [];
        setNotifications(fetchedNotifications);
        setUnreadCount(fetchedNotifications.filter(n => !n.isRead).length);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        setNotifications([]);
        setUnreadCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowSettings(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'player_match':
        return <Users style={{ height: '1.25rem', width: '1.25rem', color: '#3b82f6' }} />;
      case 'event':
        return <Calendar style={{ height: '1.25rem', width: '1.25rem', color: '#8b5cf6' }} />;
      case 'session':
        return <MessageCircle style={{ height: '1.25rem', width: '1.25rem', color: '#10b981' }} />;
      case 'achievement':
        return <Trophy style={{ height: '1.25rem', width: '1.25rem', color: '#f59e0b' }} />;
      default:
        return <Bell style={{ height: '1.25rem', width: '1.25rem', color: '#6b7280' }} />;
    }
  };

  const markAsRead = async (id: string) => {
    try {
      // Fix: Use the correct API method signature
      await api.notifications.markAsRead([id]);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Fix: Use the correct API method signature for marking all as read
      await api.notifications.markAsRead([], true);
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      // Fix: Use the correct API method signature
      await api.notifications.delete(id);
      setNotifications(prev => {
        const wasUnread = prev.find(n => n.id === id)?.isRead === false;
        if (wasUnread) {
          setUnreadCount(prevCount => Math.max(0, prevCount - 1));
        }
        return prev.filter(notif => notif.id !== id);
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const updateSettings = async (key: keyof NotificationSettings, value: boolean) => {
    try {
      setSettings(prev => ({ ...prev, [key]: value }));
      // In a real app, you would send this update to your API
      // await api.notifications.updateSettings({ [key]: value });
    } catch (error) {
      console.error('Failed to update settings:', error);
      // Revert the setting if the API call fails
      setSettings(prev => ({ ...prev, [key]: !value }));
    }
  };

  const NotificationBell = () => (
    <button
      onClick={() => setIsOpen(!isOpen)}
      style={{
        position: 'relative',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0.5rem',
        color: 'white'
      }}
    >
      <Bell style={{ height: '1.5rem', width: '1.5rem' }} />
      {unreadCount > 0 && (
        <span style={{
          position: 'absolute',
          top: '0',
          right: '0',
          backgroundColor: '#ef4444',
          color: 'white',
          borderRadius: '50%',
          width: '1.25rem',
          height: '1.25rem',
          fontSize: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold'
        }}>
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );

  const NotificationPanel = () => (
    <div
      ref={panelRef}
      style={{
        position: 'absolute',
        top: '100%',
        right: '0',
        width: '24rem',
        maxHeight: '32rem',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '0.75rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        zIndex: 50,
        marginTop: '0.5rem',
        overflow: 'hidden',
        color: '#1f2937'
      }}
    >
      <div style={{ 
        padding: '1rem', 
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)' 
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>Notifications</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                color: '#6b7280'
              }}
              title="Notification Settings"
            >
              <Settings style={{ height: '1.25rem', width: '1.25rem' }} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                color: '#6b7280'
              }}
            >
              <X style={{ height: '1.25rem', width: '1.25rem' }} />
            </button>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
              color: '#3b82f6',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            Mark all as read
          </button>
        )}
      </div>
      {showSettings ? (
        <NotificationSettings />
      ) : (
        <div style={{ maxHeight: '26rem', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
              <Bell style={{ height: '3rem', width: '3rem', margin: '0 auto 1rem', opacity: 0.5 }} />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div>
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                    backgroundColor: notification.isRead ? 'transparent' : 'rgba(59, 130, 246, 0.05)',
                    cursor: 'pointer'
                  }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{ flexShrink: 0, paddingTop: '0.25rem' }}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '0.25rem'
                      }}>
                        <h4 style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: notification.isRead ? 'normal' : '600',
                          margin: 0,
                          color: '#1f2937'
                        }}>
                          {notification.title}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.125rem',
                            color: '#9ca3af'
                          }}
                        >
                          <X style={{ height: '1rem', width: '1rem' }} />
                        </button>
                      </div>
                      <p style={{ 
                        fontSize: '0.875rem', 
                        color: '#6b7280', 
                        margin: '0 0 0.25rem 0' 
                      }}>
                        {notification.message}
                      </p>
                      <p style={{ 
                        fontSize: '0.75rem', 
                        color: '#9ca3af', 
                        margin: 0 
                      }}>
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const NotificationSettings = () => (
    <div style={{ maxHeight: '26rem', overflowY: 'auto' }}>
      <div style={{ 
        padding: '1rem', 
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)' 
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>Notification Settings</h4>
          <button
            onClick={() => setShowSettings(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
              color: '#3b82f6',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            Back
          </button>
        </div>
      </div>
      <div style={{ padding: '1rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Users style={{ height: '1.25rem', width: '1.25rem', color: '#3b82f6' }} />
            <span style={{ fontSize: '0.875rem', color: '#1f2937' }}>Player Matches</span>
          </div>
          <ToggleSwitch
            enabled={settings.playerMatches}
            onChange={(value) => updateSettings('playerMatches', value)}
          />
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Calendar style={{ height: '1.25rem', width: '1.25rem', color: '#8b5cf6' }} />
            <span style={{ fontSize: '0.875rem', color: '#1f2937' }}>New Events</span>
          </div>
          <ToggleSwitch
            enabled={settings.newEvents}
            onChange={(value) => updateSettings('newEvents', value)}
          />
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MessageCircle style={{ height: '1.25rem', width: '1.25rem', color: '#10b981' }} />
            <span style={{ fontSize: '0.875rem', color: '#1f2937' }}>Session Invites</span>
          </div>
          <ToggleSwitch
            enabled={settings.sessionInvites}
            onChange={(value) => updateSettings('sessionInvites', value)}
          />
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MessageCircle style={{ height: '1.25rem', width: '1.25rem', color: '#6b7280' }} />
            <span style={{ fontSize: '0.875rem', color: '#1f2937' }}>Messages</span>
          </div>
          <ToggleSwitch
            enabled={settings.messages}
            onChange={(value) => updateSettings('messages', value)}
          />
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Trophy style={{ height: '1.25rem', width: '1.25rem', color: '#f59e0b' }} />
            <span style={{ fontSize: '0.875rem', color: '#1f2937' }}>Achievements</span>
          </div>
          <ToggleSwitch
            enabled={settings.achievements}
            onChange={(value) => updateSettings('achievements', value)}
          />
        </div>
        <hr style={{ margin: '1rem 0', borderColor: 'rgba(0, 0, 0, 0.1)' }} />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
              Email Notifications
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
              Receive notifications via email
            </p>
          </div>
          <ToggleSwitch
            enabled={settings.emailNotifications}
            onChange={(value) => updateSettings('emailNotifications', value)}
          />
        </div>
      </div>
    </div>
  );

  const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (value: boolean) => void }> = ({ 
    enabled, 
    onChange 
  }) => (
    <button
      onClick={() => onChange(!enabled)}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: '2.5rem',
        height: '1.5rem',
        background: enabled ? '#3b82f6' : '#d1d5db',
        borderRadius: '9999px',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '0.125rem',
          left: enabled ? '1.125rem' : '0.125rem',
          display: 'inline-block',
          width: '1.25rem',
          height: '1.25rem',
          background: 'white',
          borderRadius: '9999px',
          transition: 'transform 0.2s ease',
          transform: enabled ? 'translateX(0)' : 'translateX(0)'
        }}
      />
    </button>
  );

  return (
    <div className="notification-system" style={{ position: 'relative' }}>
      <NotificationBell />
      {isOpen && (
        <div className="notification-panel">
          <NotificationPanel />
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;
