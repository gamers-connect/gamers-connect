"use client";

import React, { useState, useEffect } from 'react';
import { Bell, X, Settings, Users, Calendar, MessageCircle, Trophy } from 'lucide-react';

interface Notification {
  id: number;
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
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'player_match',
      title: 'New Player Match!',
      message: 'Alex Chen matches your Valorant preferences',
      timestamp: '2 minutes ago',
      isRead: false
    },
    {
      id: 2,
      type: 'event',
      title: 'Tournament Starting Soon',
      message: 'Valorant Tournament at UH iLab starts in 30 minutes',
      timestamp: '28 minutes ago',
      isRead: false
    },
    {
      id: 3,
      type: 'session',
      title: 'Session Invite',
      message: 'Sarah Kim invited you to join Minecraft building session',
      timestamp: '1 hour ago',
      isRead: true
    },
    {
      id: 4,
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You completed your first gaming session',
      timestamp: '2 hours ago',
      isRead: true
    }
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    playerMatches: true,
    newEvents: true,
    sessionInvites: true,
    messages: true,
    achievements: true,
    emailNotifications: false
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'player_match':
        return <Users className="notification-type-icon icon-blue" />;
      case 'event':
        return <Calendar className="notification-type-icon icon-purple" />;
      case 'session':
        return <MessageCircle className="notification-type-icon icon-green" />;
      case 'achievement':
        return <Trophy className="notification-type-icon icon-yellow" />;
      default:
        return <Bell className="notification-type-icon icon-gray" />;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const updateSettings = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const NotificationBell = () => (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="notification-bell"
    >
      <Bell className="bell-icon" />
      {unreadCount > 0 && (
        <span className="notification-badge">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );

  const NotificationPanel = () => (
    <div className="notification-dropdown">
      <div className="notification-header">
        <div className="notification-header-content">
          <h3 className="notification-panel-title">Notifications</h3>
          <div className="notification-controls">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="control-btn"
              title="Notification Settings"
            >
              <Settings className="control-icon" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="control-btn"
            >
              <X className="control-icon" />
            </button>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="mark-all-read-btn"
          >
            Mark all as read
          </button>
        )}
      </div>

      {showSettings ? (
        <NotificationSettings />
      ) : (
        <div className="notification-list-container">
          {notifications.length === 0 ? (
            <div className="empty-notifications">
              <Bell className="empty-icon" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.isRead ? 'notification-unread' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-content">
                    <div className="notification-icon-container">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-body">
                      <div className="notification-title-row">
                        <h4 className={`notification-title ${!notification.isRead ? 'title-unread' : 'title-read'}`}>
                          {notification.title}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="delete-notification-btn"
                        >
                          <X className="delete-icon" />
                        </button>
                      </div>
                      <p className="notification-message">
                        {notification.message}
                      </p>
                      <p className="notification-timestamp">
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
    <div className="settings-panel">
      <div className="settings-header">
        <h4 className="settings-title">Notification Settings</h4>
        <button
          onClick={() => setShowSettings(false)}
          className="back-btn"
        >
          Back
        </button>
      </div>
      
      <div className="settings-list">
        <div className="setting-item">
          <div className="setting-label">
            <Users className="setting-icon icon-blue" />
            <span className="setting-text">Player Matches</span>
          </div>
          <ToggleSwitch
            enabled={settings.playerMatches}
            onChange={(value) => updateSettings('playerMatches', value)}
          />
        </div>

        <div className="setting-item">
          <div className="setting-label">
            <Calendar className="setting-icon icon-purple" />
            <span className="setting-text">New Events</span>
          </div>
          <ToggleSwitch
            enabled={settings.newEvents}
            onChange={(value) => updateSettings('newEvents', value)}
          />
        </div>

        <div className="setting-item">
          <div className="setting-label">
            <MessageCircle className="setting-icon icon-green" />
            <span className="setting-text">Session Invites</span>
          </div>
          <ToggleSwitch
            enabled={settings.sessionInvites}
            onChange={(value) => updateSettings('sessionInvites', value)}
          />
        </div>

        <div className="setting-item">
          <div className="setting-label">
            <MessageCircle className="setting-icon icon-gray" />
            <span className="setting-text">Messages</span>
          </div>
          <ToggleSwitch
            enabled={settings.messages}
            onChange={(value) => updateSettings('messages', value)}
          />
        </div>

        <div className="setting-item">
          <div className="setting-label">
            <Trophy className="setting-icon icon-yellow" />
            <span className="setting-text">Achievements</span>
          </div>
          <ToggleSwitch
            enabled={settings.achievements}
            onChange={(value) => updateSettings('achievements', value)}
          />
        </div>

        <hr className="settings-divider" />

        <div className="setting-item">
          <div className="email-setting">
            <span className="email-title">Email Notifications</span>
            <p className="email-description">Receive notifications via email</p>
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
      className={`toggle-switch ${enabled ? 'toggle-enabled' : 'toggle-disabled'}`}
    >
      <span
        className={`toggle-handle ${enabled ? 'handle-enabled' : 'handle-disabled'}`}
      />
    </button>
  );

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('.notification-panel')) {
        setIsOpen(false);
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="notification-system">
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
