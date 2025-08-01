/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { Users, Calendar, Star, MessageCircle, Play } from 'lucide-react';
import PlayerCard from './PlayerCard';
import EventCard from './EventCard';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

interface GamePageProps {
  game: string;
}

interface GameGuide {
  id: string; // Changed to string
  title: string;
  author: string;
  views: number;
  rating: number;
  thumbnail: string;
}

interface GameInfo {
  description: string;
  icon: string;
  genres: string[];
  platforms: string[];
  stats: {
    totalPlayers: number;
    onlinePlayers: number;
    upcomingEvents: number;
    avgRating: number;
  };
}

const GamePage: React.FC<GamePageProps> = ({ game }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'players' | 'events' | 'guides' | 'discussion'>('players');
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [guides, setGuides] = useState<GameGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch game data on component mount and when game prop changes
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch game information (you might need to adjust this endpoint)
        // const gameInfoResponse = await api.games.getGameInfo(game);
        // setGameInfo(gameInfoResponse);

        // For now, use mock game info
        const mockGameInfo: Record<string, GameInfo> = {
          'Valorant': {
            description: 'A 5v5 character-based tactical FPS where precise gunplay meets unique agent abilities.',
            icon: '🎯',
            genres: ['FPS', 'Tactical', 'Competitive'],
            platforms: ['PC'],
            stats: { totalPlayers: 89, onlinePlayers: 23, upcomingEvents: 4, avgRating: 4.7 }
          },
          'Overwatch 2': {
            description: 'A team-based multiplayer FPS with heroes, each with unique abilities.',
            icon: '🦾',
            genres: ['FPS', 'Hero Shooter', 'Team-based'],
            platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
            stats: { totalPlayers: 67, onlinePlayers: 18, upcomingEvents: 2, avgRating: 4.5 }
          },
          'Minecraft': {
            description: 'A sandbox game focused on creativity, building, and exploration.',
            icon: '🧱',
            genres: ['Sandbox', 'Survival', 'Creative'],
            platforms: ['PC', 'Mobile', 'PlayStation', 'Xbox', 'Nintendo Switch'],
            stats: { totalPlayers: 45, onlinePlayers: 12, upcomingEvents: 3, avgRating: 4.8 }
          }
        };
        setGameInfo(mockGameInfo[game] || mockGameInfo['Valorant']);

        // Fetch players for this game
        const playersResponse = await api.users.getAll({ game, limit: 12 });
        setPlayers(playersResponse.users);

        // Fetch events for this game
        const eventsResponse = await api.events.getAll({ game, upcoming: true, limit: 6 });
        setEvents(eventsResponse.events);

        // For guides, use mock data since there's no specific API endpoint shown
        const mockGuidesData: GameGuide[] = [
          { id: '1', title: `${game} Beginner's Guide`, author: 'ProGamer123', views: 1247, rating: 4.8, thumbnail: '📖' },
          { id: '2', title: `Advanced ${game} Strategies`, author: 'StrategyMaster', views: 892, rating: 4.6, thumbnail: '🧠' },
          { id: '3', title: `${game} Settings Optimization`, author: 'TechGuru', views: 1456, rating: 4.9, thumbnail: '⚙️' }
        ];
        setGuides(mockGuidesData);

      } catch (err) {
        console.error('Failed to fetch game ', err);
        setError('Failed to load game data.');
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [game]);

  const handleJoinEvent = async (eventId: string) => {
    if (!user) {
      console.log('User must be logged in to join event');
      return;
    }

    try {
      // Fix: Use the correct API method signature from your api.ts
      // The method is `join` and takes (eventId, userId)
      await api.events.join(eventId, user.id);
      
      // Refresh events data
      const eventsResponse = await api.events.getAll({ game, upcoming: true, limit: 6 });
      setEvents(eventsResponse.events);
      
      console.log('Successfully joined event:', eventId);
    } catch (err) {
      console.error('Failed to join event:', err);
    }
  };

  const handleConnectWithPlayer = async (playerId: string) => {
    if (!user) {
      console.log('User must be logged in to connect with player');
      return;
    }

    try {
      // Fix: Use the correct API method signature from your api.ts
      // The method is `send` and takes (fromUserId, toUserId, message)
      await api.connections.send(user.id, playerId, `Hi! I play ${game} too. Want to team up?`);
      
      console.log('Connection request sent to player:', playerId);
    } catch (err) {
      console.error('Failed to send connection request:', err);
    }
  };

  const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
    <div style={{
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      textAlign: 'center',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '0.75rem' 
      }}>
        {icon}
      </div>
      <div style={{ 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        color: '#1f2937', 
        marginBottom: '0.25rem' 
      }}>
        {value}
      </div>
      <div style={{ 
        fontSize: '0.875rem', 
        color: '#6b7280' 
      }}>
        {label}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ 
        maxWidth: '72rem', 
        margin: '0 auto', 
        padding: '1.5rem',
        textAlign: 'center',
        color: '#6b7280'
      }}>
        Loading {game} data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        maxWidth: '72rem', 
        margin: '0 auto', 
        padding: '1.5rem',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#ef4444',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // Use mock game info if API data is not available
  const fallbackGameInfo: Record<string, GameInfo> = {
    'Valorant': {
      description: 'A 5v5 character-based tactical FPS where precise gunplay meets unique agent abilities.',
      icon: '🎯',
      genres: ['FPS', 'Tactical', 'Competitive'],
      platforms: ['PC'],
      stats: { totalPlayers: 89, onlinePlayers: 23, upcomingEvents: 4, avgRating: 4.7 }
    },
    'Overwatch 2': {
      description: 'A team-based multiplayer FPS with heroes, each with unique abilities.',
      icon: '🦾',
      genres: ['FPS', 'Hero Shooter', 'Team-based'],
      platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
      stats: { totalPlayers: 67, onlinePlayers: 18, upcomingEvents: 2, avgRating: 4.5 }
    },
    'Minecraft': {
      description: 'A sandbox game focused on creativity, building, and exploration.',
      icon: '🧱',
      genres: ['Sandbox', 'Survival', 'Creative'],
      platforms: ['PC', 'Mobile', 'PlayStation', 'Xbox', 'Nintendo Switch'],
      stats: { totalPlayers: 45, onlinePlayers: 12, upcomingEvents: 3, avgRating: 4.8 }
    }
  };

  const currentGame = gameInfo || fallbackGameInfo[game] || fallbackGameInfo['Valorant'];

  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '1.5rem' }}>
      {/* Game Header */}
      <div style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.75rem',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
          <div style={{ fontSize: '3rem' }}>{currentGame.icon}</div>
          <div style={{ flex: 1 }}>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              marginBottom: '0.5rem' 
            }}>
              {game}
            </h1>
            <p style={{ 
              color: '#4b5563', 
              fontSize: '1rem', 
              marginBottom: '1rem' 
            }}>
              {currentGame.description}
            </p>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '0.5rem', 
              marginBottom: '1rem' 
            }}>
              {currentGame.genres.map(genre => (
                <span key={genre} style={{
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  {genre}
                </span>
              ))}
            </div>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '0.5rem' 
            }}>
              {currentGame.platforms.map(platform => (
                <span key={platform} style={{
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Game Statistics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2rem' 
      }}>
        <StatCard
          icon={<Users style={{ height: '1.5rem', width: '1.5rem', color: '#1f2937' }} />}
          label="Total Players"
          value={currentGame.stats.totalPlayers}
        />
        <StatCard
          icon={<div style={{ 
            width: '1.5rem', 
            height: '1.5rem', 
            borderRadius: '50%', 
            backgroundColor: '#10b981' 
          }} />}
          label="Online Now"
          value={currentGame.stats.onlinePlayers}
        />
        <StatCard
          icon={<Calendar style={{ height: '1.5rem', width: '1.5rem', color: '#1f2937' }} />}
          label="Upcoming Events"
          value={currentGame.stats.upcomingEvents}
        />
        <StatCard
          icon={<Star style={{ height: '1.5rem', width: '1.5rem', color: '#fbbf24' }} />}
          label="Avg Rating"
          value={currentGame.stats.avgRating.toFixed(1)}
        />
      </div>

      {/* Navigation Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '0.25rem', 
        marginBottom: '2rem',
        borderBottom: '1px solid #e5e7eb'
      }}>
        {[
          { key: 'players', label: 'Active Players', icon: Users },
          { key: 'events', label: 'Events', icon: Calendar },
          { key: 'guides', label: 'Guides', icon: Play },
          { key: 'discussion', label: 'Discussion', icon: MessageCircle }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            style={{
              padding: '0.75rem 1.5rem',
              borderBottom: activeTab === key ? '2px solid #3b82f6' : 'none',
              backgroundColor: 'transparent',
              color: activeTab === key ? '#3b82f6' : '#6b7280',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Icon style={{ height: '1rem', width: '1rem' }} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'players' && (
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1.5rem' 
            }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#1f2937' 
              }}>
                Active {game} Players
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                <div style={{ 
                  width: '0.75rem', 
                  height: '0.75rem', 
                  borderRadius: '50%', 
                  backgroundColor: '#10b981' 
                }} />
                <span>{currentGame.stats.onlinePlayers} online now</span>
              </div>
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {players.map(player => (
                <PlayerCard 
                  key={player.id} 
                  player={player} 
                  showRating 
                  isDetailed 
                  onUpdate={() => handleConnectWithPlayer(player.id)} // Pass connect handler
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1.5rem' 
            }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#1f2937' 
              }}>
                Upcoming {game} Events
              </h3>
              <button style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
              }}
              >
                Create Event
              </button>
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {events.map(event => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onUpdate={() => handleJoinEvent(event.id)} // Pass join handler
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'guides' && (
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1.5rem' 
            }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#1f2937' 
              }}>
                {game} Guides & Tutorials
              </h3>
              <button style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
              }}
              >
                Upload Guide
              </button>
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {guides.map(guide => (
                <div key={guide.id} style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}>
                  <div style={{ 
                    padding: '1.5rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1rem' 
                  }}>
                    <div style={{ 
                      fontSize: '2rem', 
                      textAlign: 'center' 
                    }}>
                      {guide.thumbnail}
                    </div>
                    <h4 style={{ 
                      fontSize: '1rem', 
                      fontWeight: '600', 
                      color: '#1f2937', 
                      margin: 0 
                    }}>
                      {guide.title}
                    </h4>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: '#6b7280', 
                      margin: 0 
                    }}>
                      by {guide.author}
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.25rem' 
                      }}>
                        <Star style={{ 
                          height: '1rem', 
                          width: '1rem', 
                          color: '#fbbf24' 
                        }} />
                        <span style={{ 
                          fontSize: '0.875rem', 
                          color: '#4b5563' 
                        }}>
                          {guide.rating}
                        </span>
                      </div>
                      <span style={{ 
                        fontSize: '0.875rem', 
                        color: '#6b7280' 
                      }}>
                        {guide.views} views
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'discussion' && (
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1.5rem' 
            }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#1f2937' 
              }}>
                {game} Discussion
              </h3>
              <button style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
              }}
              >
                New Topic
              </button>
            </div>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem' 
            }}>
              {[
                { title: `Best ${game} strategies for beginners`, author: 'GameMaster', replies: 15, lastActivity: '2 hours ago' },
                { title: `${game} tournament team formation`, author: 'ProPlayer', replies: 8, lastActivity: '4 hours ago' },
                { title: `Looking for ${game} practice partners`, author: 'NewGamer', replies: 23, lastActivity: '1 day ago' }
              ].map((topic, index) => (
                <div key={index} style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}>
                  <h4 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    color: '#1f2937', 
                    marginBottom: '0.5rem' 
                  }}>
                    {topic.title}
                  </h4>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    <span>by {topic.author}</span>
                    <div style={{ 
                      display: 'flex', 
                      gap: '1rem' 
                    }}>
                      <span>{topic.replies} replies</span>
                      <span>last activity {topic.lastActivity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;
