"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Settings, Users, Calendar, MessageCircle, Trophy } from 'lucide-react';
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
  const bellRef = useRef<HTMLButtonElement>(null);

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
        // Mock data for demo
        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'event',
            title: 'New Event: Valorant Tournament',
            message: 'A new tournament has been created for this weekend',
            timestamp: '30m ago',
            isRead: false,
            actionUrl: '/events/1'
          },
          {
            id: '2',
            type: 'player_match',
            title: 'New Player Match',
            message: 'Someone is looking for Overwatch 2 teammates',
            timestamp: '2h ago',
            isRead: false,
            actionUrl: '/players/2'
          },
          {
            id: '3',
            type: 'session',
            title: 'Gaming Session Starting',
            message: 'Your Minecraft session starts in 15 minutes',
            timestamp: '6h ago',
            isRead: true
          }
        ];
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
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

  // ULTIMATE FIX: Add/remove body styles when notification opens
  useEffect(() => {
    if (isOpen) {
      // Create a unique class for maximum z-index
      const style = document.createElement('style');
      style.id = 'notification-z-index-fix';
      style.textContent = `
        .notification-system-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          z-index: 9999999 !important;
          pointer-events: auto !important;
        }
        .notification-system-panel {
          position: fixed !important;
          z-index: 9999999 !important;
          pointer-events: auto !important;
          transform: translate3d(0, 0, 999px) !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        const existingStyle = document.getElementById('notification-z-index-fix');
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      };
    }
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
      await api.notifications.markAsRead([id]);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Update locally even if API fails
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.notifications.markAsRead([], true);
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      // Update locally even if API fails
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
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
      // Update locally even if API fails
      setNotifications(prev => {
        const wasUnread = prev.find(n => n.id === id)?.isRead === false;
        if (wasUnread) {
          setUnreadCount(prevCount => Math.max(0, prevCount - 1));
        }
        return prev.filter(notif => notif.id !== id);
      });
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
          transition: 'left 0.2s ease',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
      />
    </button>
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
              fontWeight: '500',
              borderRadius: '0.25rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#dbeafe';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Back
          </button>
        </div>
      </div>
      <div style={{ padding: '1rem' }}>
        {[
          { key: 'playerMatches' as const, label: 'Player Matches', icon: Users, color: '#3b82f6' },
          { key: 'newEvents' as const, label: 'New Events', icon: Calendar, color: '#8b5cf6' },
          { key: 'sessionInvites' as const, label: 'Session Invites', icon: MessageCircle, color: '#10b981' },
          { key: 'messages' as const, label: 'Messages', icon: MessageCircle, color: '#6b7280' },
          { key: 'achievements' as const, label: 'Achievements', icon: Trophy, color: '#f59e0b' },
        ].map(({ key, label, icon: Icon, color }) => (
          <div key={key} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Icon style={{ height: '1.25rem', width: '1.25rem', color }} />
              <span style={{ fontSize: '0.875rem', color: '#1f2937' }}>{label}</span>
            </div>
            <ToggleSwitch
              enabled={settings[key]}
              onChange={(value) => updateSettings(key, value)}
            />
          </div>
        ))}
        
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

  return (
    <div style={{ position: 'relative' }}>
      {/* Notification Bell Button */}
      <button
        ref={bellRef}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.5rem',
          color: 'white',
          transition: 'all 0.2s ease',
          borderRadius: '0.5rem'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
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
            fontWeight: 'bold',
            border: '2px solid rgba(255, 255, 255, 0.2)'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* FINAL SOLUTION: Notification Panel with dynamic CSS injection */}
      {isOpen && (
        <>
          {/* Full-screen overlay */}
          <div
            className="notification-system-overlay"
            style={{
              backgroundColor: 'transparent'
            }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification panel */}
          <div
            ref={panelRef}
            className="notification-system-panel"
            style={{
              top: '4rem',
              right: '2rem',
              width: '24rem',
              maxHeight: '32rem',
              background: 'white',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '0.75rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              color: '#1f2937',
              isolation: 'isolate',
              backfaceVisibility: 'hidden',
              perspective: '1000px',
              willChange: 'transform',
              contain: 'layout style paint'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
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
                      color: '#6b7280',
                      borderRadius: '0.25rem',
                      transition: 'all 0.2s ease'
                    }}
                    title="Notification Settings"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                      e.currentTarget.style.color = '#374151';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#6b7280';
                    }}
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
                      color: '#6b7280',
                      borderRadius: '0.25rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                      e.currentTarget.style.color = '#374151';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#6b7280';
                    }}
                  >
                    <X style={{ height: '1.25rem', width: '1.25rem' }} />
                  </button>
                </div>
              </div>
              {unreadCount > 0 && !showSettings && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem 0.5rem',
                    color: '#3b82f6',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    borderRadius: '0.25rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#dbeafe';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Content */}
            {showSettings ? (
              <NotificationSettings />
            ) : (
              <div style={{ maxHeight: '26rem', overflowY: 'auto' }}>
                {loading ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      border: '2px solid #f3f4f6',
                      borderTop: '2px solid #3b82f6',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      margin: '0 auto 1rem'
                    }} />
                    Loading notifications...
                    <style>{`
                      @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                    `}</style>
                  </div>
                ) : notifications.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                    <Bell style={{ height: '3rem', width: '3rem', margin: '0 auto 1rem', opacity: 0.5, color: '#d1d5db' }} />
                    <p style={{ margin: 0, fontSize: '0.875rem' }}>No notifications yet</p>
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
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                        onClick={() => {
                          markAsRead(notification.id);
                          if (notification.actionUrl) {
                            window.location.href = notification.actionUrl;
                          }
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = notification.isRead ? 'transparent' : 'rgba(59, 130, 246, 0.05)';
                        }}
                      >
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <div style={{ flexShrink: 0, paddingTop: '0.25rem' }}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'flex-start',
                              marginBottom: '0.25rem'
                            }}>
                              <h4 style={{ 
                                fontSize: '0.875rem', 
                                fontWeight: notification.isRead ? '500' : '600',
                                margin: 0,
                                color: '#1f2937',
                                lineHeight: '1.25'
                              }}>
                                {notification.title}
                              </h4>
                              
                              {!notification.isRead && (
                                <div style={{
                                  width: '0.5rem',
                                  height: '0.5rem',
                                  backgroundColor: '#3b82f6',
                                  borderRadius: '50%',
                                  flexShrink: 0,
                                  marginLeft: '0.5rem',
                                  marginTop: '0.125rem'
                                }} />
                              )}
                            </div>
                            
                            <p style={{ 
                              fontSize: '0.875rem', 
                              color: '#6b7280', 
                              margin: '0 0 0.5rem 0',
                              lineHeight: '1.4'
                            }}>
                              {notification.message}
                            </p>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ 
                                fontSize: '0.75rem', 
                                color: '#9ca3af' 
                              }}>
                                {notification.timestamp}
                              </span>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                style={{
                                  padding: '0.25rem',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: '#9ca3af',
                                  borderRadius: '0.25rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                                  e.currentTarget.style.color = '#6b7280';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                  e.currentTarget.style.color = '#9ca3af';
                                }}
                              >
                                <X style={{ height: '0.875rem', width: '0.875rem' }} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            {notifications.length > 0 && !showSettings && (
              <div style={{
                padding: '0.75rem 1rem',
                borderTop: '1px solid #e5e7eb',
                textAlign: 'center'
              }}>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    window.location.href = '/notifications';
                  }}
                  style={{
                    fontSize: '0.875rem',
                    color: '#3b82f6',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#1d4ed8'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#3b82f6'}
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationSystem;
