"use client";

import React, { useState } from 'react';
import { Users, Calendar, Star, MessageCircle, Play } from 'lucide-react';
import PlayerCard from './PlayerCard';
import EventCard from './EventCard';

interface GamePageProps {
  game: string;
}

interface GameGuide {
  id: number;
  title: string;
  author: string;
  views: number;
  rating: number;
  thumbnail: string;
}

const GamePage: React.FC<GamePageProps> = ({ game }) => {
  const [activeTab, setActiveTab] = useState<'players' | 'events' | 'guides' | 'discussion'>('players');

  // Mock data - in real app this would come from API
  const gameInfo = {
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

  const currentGame = gameInfo[game as keyof typeof gameInfo] || gameInfo['Valorant'];

  const mockPlayers = [
    { id: 1, name: 'Alex Chen', games: [game], platform: 'PC', playstyle: 'Competitive', location: 'UH Mānoa Campus', status: 'online' as const, rating: 4.8 },
    { id: 2, name: 'Sarah Kim', games: [game], platform: 'PC', playstyle: 'Casual', location: 'UH Mānoa Campus', status: 'online' as const, rating: 4.9 },
    { id: 3, name: 'Marcus Johnson', games: [game], platform: 'PC', playstyle: 'Competitive', location: 'UH West Oahu', status: 'away' as const, rating: 4.7 }
  ];

  const mockEvents = [
    { id: 1, title: `${game} Tournament`, game, date: '2025-07-25', time: '18:00', location: 'UH iLab', type: 'Tournament' as const, attendees: 32, maxAttendees: 64 },
    { id: 2, title: `${game} Scrimmage`, game, date: '2025-07-24', time: '20:00', location: 'Hamilton Library', type: 'Scrimmage' as const, attendees: 18, maxAttendees: 24 }
  ];

  const mockGuides: GameGuide[] = [
    { id: 1, title: `${game} Beginner's Guide`, author: 'ProGamer123', views: 1247, rating: 4.8, thumbnail: '📖' },
    { id: 2, title: `Advanced ${game} Strategies`, author: 'StrategyMaster', views: 892, rating: 4.6, thumbnail: '🧠' },
    { id: 3, title: `${game} Settings Optimization`, author: 'TechGuru', views: 1456, rating: 4.9, thumbnail: '⚙️' }
  ];

  const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );

  return (
    <div className="game-page-container">
      {/* Game Header */}
      <div className="game-header">
        <div className="game-header-content">
          <div className="game-icon">{currentGame.icon}</div>
          <div className="game-info">
            <h1 className="game-title">{game}</h1>
            <p className="game-description">{currentGame.description}</p>
            <div className="game-genres">
              {currentGame.genres.map(genre => (
                <span key={genre} className="genre-tag">
                  {genre}
                </span>
              ))}
            </div>
            <div className="game-platforms">
              {currentGame.platforms.map(platform => (
                <span key={platform} className="platform-tag">
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Game Statistics */}
      <div className="stats-grid">
        <StatCard
          icon={<Users className="h-6 w-6 text-black" />}
          label="Total Players"
          value={currentGame.stats.totalPlayers}
        />
        <StatCard
          icon={<div className="online-indicator" />}
          label="Online Now"
          value={currentGame.stats.onlinePlayers}
        />
        <StatCard
          icon={<Calendar className="h-6 w-6 text-black" />}
          label="Upcoming Events"
          value={currentGame.stats.upcomingEvents}
        />
        <StatCard
          icon={<Star className="h-6 w-6 text-yellow-500 fill-current" />}
          label="Avg Rating"
          value={currentGame.stats.avgRating}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="game-tabs">
        {[
          { key: 'players', label: 'Active Players', icon: Users },
          { key: 'events', label: 'Events', icon: Calendar },
          { key: 'guides', label: 'Guides', icon: Play },
          { key: 'discussion', label: 'Discussion', icon: MessageCircle }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as 'players' | 'events' | 'guides' | 'discussion' )}
            className={`game-tab ${activeTab === key ? 'game-tab-active' : ''}`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'players' && (
          <div>
            <div className="section-header">
              <h3 className="section-title">Active {game} Players</h3>
              <div className="online-status">
                <div className="online-dot"></div>
                <span>{currentGame.stats.onlinePlayers} online now</span>
              </div>
            </div>
            <div className="players-grid">
              {mockPlayers.map(player => (
                <PlayerCard key={player.id} player={player} showRating isDetailed />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <div className="section-header">
              <h3 className="section-title">Upcoming {game} Events</h3>
              <button className="btn btn-primary">
                Create Event
              </button>
            </div>
            <div className="events-grid">
              {mockEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'guides' && (
          <div>
            <div className="section-header">
              <h3 className="section-title">{game} Guides & Tutorials</h3>
              <button className="btn btn-primary">
                Upload Guide
              </button>
            </div>
            <div className="guides-grid">
              {mockGuides.map(guide => (
                <div key={guide.id} className="guide-card">
                  <div className="guide-content">
                    <div className="guide-thumbnail">{guide.thumbnail}</div>
                    <h4 className="guide-title">{guide.title}</h4>
                    <p className="guide-author">by {guide.author}</p>
                    <div className="guide-stats">
                      <div className="guide-rating">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{guide.rating}</span>
                      </div>
                      <span className="guide-views">{guide.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'discussion' && (
          <div>
            <div className="section-header">
              <h3 className="section-title">{game} Discussion</h3>
              <button className="btn btn-primary">
                New Topic
              </button>
            </div>
            <div className="discussion-list">
              {[
                { title: `Best ${game} strategies for beginners`, author: 'GameMaster', replies: 15, lastActivity: '2 hours ago' },
                { title: `${game} tournament team formation`, author: 'ProPlayer', replies: 8, lastActivity: '4 hours ago' },
                { title: `Looking for ${game} practice partners`, author: 'NewGamer', replies: 23, lastActivity: '1 day ago' }
              ].map((topic, index) => (
                <div key={index} className="discussion-topic">
                  <h4 className="topic-title">{topic.title}</h4>
                  <div className="topic-meta">
                    <span>by {topic.author}</span>
                    <div className="topic-stats">
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
