"use client";

import React, { useState } from 'react';
import { Users, Calendar, TrendingUp, Star, MessageCircle, Play } from 'lucide-react';
import { PlayerCard } from './PlayerCard';
import { EventCard } from './EventCard';

interface GamePageProps {
  game: string;
}

interface GameStats {
  totalPlayers: number;
  onlinePlayers: number;
  upcomingEvents: number;
  avgRating: number;
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
    <div className="bg-white rounded-lg p-4 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Game Header */}
      <div className="bg-gradient-to-r from-gray-800 to-black rounded-xl p-8 mb-8 text-white">
        <div className="flex items-center space-x-6">
          <div className="text-6xl">{currentGame.icon}</div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{game}</h1>
            <p className="text-gray-200 mb-4">{currentGame.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {currentGame.genres.map(genre => (
                <span key={genre} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {genre}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {currentGame.platforms.map(platform => (
                <span key={platform} className="bg-gray-600 px-3 py-1 rounded-full text-sm">
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Game Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Users className="h-6 w-6 text-black" />}
          label="Total Players"
          value={currentGame.stats.totalPlayers}
        />
        <StatCard
          icon={<div className="w-3 h-3 bg-green-500 rounded-full" />}
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
      <div className="flex space-x-1 mb-6">
        {[
          { key: 'players', label: 'Active Players', icon: Users },
          { key: 'events', label: 'Events', icon: Calendar },
          { key: 'guides', label: 'Guides', icon: Play },
          { key: 'discussion', label: 'Discussion', icon: MessageCircle }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as 'players' | 'events' | 'guides' | 'discussion' )}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              activeTab === key ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'players' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Active {game} Players</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{currentGame.stats.onlinePlayers} online now</span>
              </div>
            </div>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
              {mockPlayers.map(player => (
                <PlayerCard key={player.id} player={player} showRating isDetailed />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Upcoming {game} Events</h3>
              <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                Create Event
              </button>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              {mockEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'guides' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">{game} Guides & Tutorials</h3>
              <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                Upload Guide
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockGuides.map(guide => (
                <div key={guide.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="p-6">
                    <div className="text-4xl mb-4 text-center">{guide.thumbnail}</div>
                    <h4 className="font-semibold mb-2">{guide.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">by {guide.author}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{guide.rating}</span>
                      </div>
                      <span>{guide.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'discussion' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">{game} Discussion</h3>
              <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                New Topic
              </button>
            </div>
            <div className="space-y-4">
              {[
                { title: `Best ${game} strategies for beginners`, author: 'GameMaster', replies: 15, lastActivity: '2 hours ago' },
                { title: `${game} tournament team formation`, author: 'ProPlayer', replies: 8, lastActivity: '4 hours ago' },
                { title: `Looking for ${game} practice partners`, author: 'NewGamer', replies: 23, lastActivity: '1 day ago' }
              ].map((topic, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                  <h4 className="font-semibold mb-2 hover:text-gray-600">{topic.title}</h4>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>by {topic.author}</span>
                    <div className="flex items-center space-x-4">
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
