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

export const NotificationSystem: React.FC = () => {
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
        return <Users className="h-5 w-5 text-blue-600" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-purple-600" />;
      case 'session':
        return <MessageCircle className="h-5 w-5 text-green-600" />;
      case 'achievement':
        return <Trophy className="h-5 w-5 text-yellow-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
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
      className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <Bell className="h-6 w-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );

  const NotificationPanel = () => (
    <div className="fixed top-16 right-4 bg-white rounded-xl shadow-2xl border w-96 max-h-[600px] z-50 overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">Notifications</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1 hover:bg-gray-200 rounded"
              title="Notification Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800 mt-2"
          >
            Mark all as read
          </button>
        )}
      </div>

      {showSettings ? (
        <NotificationSettings />
      ) : (
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className={`text-sm font-medium ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
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
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium">Notification Settings</h4>
        <button
          onClick={() => setShowSettings(false)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Back
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm">Player Matches</span>
          </div>
          <ToggleSwitch
            enabled={settings.playerMatches}
            onChange={(value) => updateSettings('playerMatches', value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span className="text-sm">New Events</span>
          </div>
          <ToggleSwitch
            enabled={settings.newEvents}
            onChange={(value) => updateSettings('newEvents', value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm">Session Invites</span>
          </div>
          <ToggleSwitch
            enabled={settings.sessionInvites}
            onChange={(value) => updateSettings('sessionInvites', value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4 text-gray-600" />
            <span className="text-sm">Messages</span>
          </div>
          <ToggleSwitch
            enabled={settings.messages}
            onChange={(value) => updateSettings('messages', value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-yellow-600" />
            <span className="text-sm">Achievements</span>
          </div>
          <ToggleSwitch
            enabled={settings.achievements}
            onChange={(value) => updateSettings('achievements', value)}
          />
        </div>

        <hr className="my-4" />

        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium">Email Notifications</span>
            <p className="text-xs text-gray-500">Receive notifications via email</p>
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
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-black' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
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
    <div className="relative">
      <NotificationBell />
      {isOpen && (
        <div className="notification-panel">
          <NotificationPanel />
        </div>
      )}
    </div>
  );
};