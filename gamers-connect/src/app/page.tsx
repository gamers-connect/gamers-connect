"use client";

import React, { useState } from 'react';
import { Gamepad2, Users, Calendar, Trophy, Plus, MessageCircle } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { PlayerCard } from '../components/PlayerCard';
//import { EventCard } from '../components/EventCard';
//import { FilterBar } from '../components/FilterBar';
import { QuickActions } from '../components/QuickActions';
//import { NotificationPanel } from '../components/NotificationPanel';

// Types
interface User {
  id: number;
  name: string;
  email: string;
  games: string[];
  platforms: string[];
  playstyle: string;
  location: string;
  bio: string;
  discord: string;
  notifications: boolean;
  avatar: string;
}

interface Player {
  id: number;
  name: string;
  games: string[];
  platform: string;
  playstyle: string;
  location: string;
  status: 'online' | 'away' | 'offline';
  rating: number;
}

interface GameEvent {
  id: number;
  title: string;
  game: string;
  date: string;
  time: string;
  location: string;
  type: 'Tournament' | 'Meetup' | 'Contest' | 'Scrimmage';
  attendees: number;
  maxAttendees: number;
}

interface GameSession {
  id: number;
  title: string;
  game: string;
  host: string;
  date: string;
  time: string;
  players: number;
  maxPlayers: number;
}

// Mock data
const mockGames = [
  'Valorant', 'Overwatch 2', 'Super Smash Bros', 'League of Legends', 
  'Apex Legends', 'Rocket League', 'Minecraft', 'Among Us'
];

const mockPlatforms = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];
const mockPlaystyles = ['Casual', 'Competitive', 'Cooperative'];

const mockPlayers: Player[] = [
  { id: 1, name: 'Alex Chen', games: ['Valorant', 'Overwatch 2'], platform: 'PC', playstyle: 'Competitive', location: 'UH Mānoa Campus', status: 'online', rating: 4.8 },
  { id: 2, name: 'Sarah Kim', games: ['Super Smash Bros', 'Minecraft'], platform: 'Nintendo Switch', playstyle: 'Casual', location: 'UH Mānoa Campus', status: 'online', rating: 4.9 },
  { id: 3, name: 'Marcus Johnson', games: ['Apex Legends', 'Rocket League'], platform: 'PC', playstyle: 'Competitive', location: 'UH West Oahu', status: 'away', rating: 4.7 },
  { id: 4, name: 'Luna Patel', games: ['League of Legends', 'Valorant'], platform: 'PC', playstyle: 'Competitive', location: 'UH Mānoa Campus', status: 'online', rating: 4.6 }
];

const mockEvents: GameEvent[] = [
  { id: 1, title: 'Valorant Tournament', game: 'Valorant', date: '2025-07-25', time: '18:00', location: 'UH iLab', type: 'Tournament', attendees: 32, maxAttendees: 64 },
  { id: 2, title: 'Smash Bros Meetup', game: 'Super Smash Bros', date: '2025-07-22', time: '19:00', location: 'Campus Center', type: 'Meetup', attendees: 12, maxAttendees: 20 },
  { id: 3, title: 'Minecraft Build Contest', game: 'Minecraft', date: '2025-07-28', time: '15:00', location: 'Online', type: 'Contest', attendees: 8, maxAttendees: 15 },
  { id: 4, title: 'Overwatch 2 Scrimmage', game: 'Overwatch 2', date: '2025-07-24', time: '20:00', location: 'Hamilton Library', type: 'Scrimmage', attendees: 18, maxAttendees: 24 }
];

const mockSessions: GameSession[] = [
  { id: 1, title: 'Ranked Valorant Grind', game: 'Valorant', host: 'Alex Chen', date: '2025-07-20', time: '21:00', players: 3, maxPlayers: 5 },
  { id: 2, title: 'Chill Minecraft Building', game: 'Minecraft', host: 'Sarah Kim', date: '2025-07-21', time: '16:00', players: 2, maxPlayers: 6 }
];

// Landing Page Component
const LandingPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
    <nav className="flex justify-between items-center p-6">
      <div className="flex items-center space-x-2">
        <Gamepad2 className="h-8 w-8 text-gray-400" />
        <h1 className="text-2xl font-bold">Game Connect</h1>
      </div>
      <div className="space-x-4">
        <button 
          onClick={onLogin}
          className="px-6 py-2 bg-transparent border border-white rounded-lg hover:bg-white hover:text-black transition-all"
        >
          Login
        </button>
        <button 
          onClick={onLogin}
          className="px-6 py-2 bg-gray-300 text-black rounded-lg hover:bg-white transition-all font-semibold"
        >
          Sign Up
        </button>
      </div>
    </nav>

    <div className="container mx-auto px-6 py-20">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
          Connect. Play. Compete.
        </h2>
        <p className="text-xl mb-8 text-gray-300">
          The ultimate gaming community for University of Hawaiʻi students. Find teammates, 
          join tournaments, and discover gaming events right here on campus.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/20 transition-all">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Find Teammates</h3>
            <p className="text-gray-300">Connect with fellow UH gamers who share your interests and playstyle</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/20 transition-all">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Join Events</h3>
            <p className="text-gray-300">Discover tournaments, meetups, and gaming events happening on campus</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/20 transition-all">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Compete</h3>
            <p className="text-gray-300">Participate in tournaments and showcase your gaming skills</p>
          </div>
        </div>

        <button 
          onClick={onLogin}
          className="mt-12 px-8 py-4 bg-gradient-to-r from-gray-300 to-white text-black rounded-xl font-bold text-lg hover:from-gray-400 hover:to-gray-100 transition-all transform hover:scale-105"
        >
          Get Started Today
        </button>
      </div>
    </div>
  </div>
);

// Dashboard Component
const Dashboard: React.FC<{ user: User; onPageChange: (page: string) => void }> = ({ user, onPageChange }) => (
  <div className="container mx-auto px-6 py-8">
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user.name}!</h2>
      <p className="text-gray-600">Here's what's happening in your gaming community</p>
    </div>

    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-black" />
            Recommended Players
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {mockPlayers.slice(0, 4).map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Gamepad2 className="h-5 w-5 mr-2 text-black" />
            Your Gaming Sessions
          </h3>
          <div className="space-y-4">
            {mockSessions.map(session => (
              <div key={session.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{session.title}</h4>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                    {session.game}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Hosted by {session.host}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{session.date} at {session.time}</span>
                  <span>{session.players}/{session.maxPlayers} players</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <QuickActions onFindPlayers={() => onPageChange('players')} />

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-black" />
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {mockEvents.slice(0, 3).map(event => (
              <EventCard key={event.id} event={event} isCompact />
            ))}
          </div>
          <button 
            onClick={() => onPageChange('events')}
            className="w-full mt-4 text-black py-2 text-sm hover:bg-gray-50 rounded-lg transition-colors"
          >
            View All Events
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Find Players Component
const FindPlayers: React.FC = () => {
  const [searchGame, setSearchGame] = useState('');
  const [searchPlatform, setSearchPlatform] = useState('');
  const [searchPlaystyle, setSearchPlaystyle] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', { searchGame, searchPlatform, searchPlaystyle });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Find Players</h2>
        <p className="text-gray-600">Connect with fellow UH gamers who share your interests</p>
      </div>

      <FilterBar
        games={mockGames}
        platforms={mockPlatforms}
        playstyles={mockPlaystyles}
        searchGame={searchGame}
        searchPlatform={searchPlatform}
        searchPlaystyle={searchPlaystyle}
        onGameChange={setSearchGame}
        onPlatformChange={setSearchPlatform}
        onPlaystyleChange={setSearchPlaystyle}
        onSearch={handleSearch}
      />

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
        {mockPlayers.map(player => (
          <PlayerCard key={player.id} player={player} showRating isDetailed />
        ))}
      </div>
    </div>
  );
};

// Events Component
const Events: React.FC = () => (
  <div className="container mx-auto px-6 py-8">
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Gaming Events</h2>
      <p className="text-gray-600">Discover tournaments, meetups, and gaming events at UH</p>
    </div>

    <div className="mb-6">
      <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2">
        <Plus className="h-4 w-4" />
        <span>Create Event</span>
      </button>
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      {mockEvents.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  </div>
);

// Profile Component
const Profile: React.FC<{ user: User }> = ({ user }) => (
  <div className="container mx-auto px-6 py-8">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-black px-6 py-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl">
              {user.avatar}
            </div>
            <div className="text-white">
              <h2 className="text-3xl font-bold">{user.name}</h2>
              <p className="text-gray-200">{user.email}</p>
              <p className="text-gray-200">{user.location}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Gaming Preferences</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Favorite Games</label>
                    <div className="flex flex-wrap gap-2">
                      {user.games.map(game => (
                        <span key={game} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                          {game}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
                    <div className="flex flex-wrap gap-2">
                      {user.platforms.map(platform => (
                        <span key={platform} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Playstyle</label>
                    <span className="bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm">
                      {user.playstyle}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Bio</h3>
                <p className="text-gray-600">{user.bio}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Contact Info</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Discord: {user.discord}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notifications</span>
                    <button className={`w-12 h-6 rounded-full transition-colors ${
                      user.notifications ? 'bg-black' : 'bg-gray-300'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        user.notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}></div>
                    </button>
                  </div>
                </div>
              </div>

              <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main App Component
export default function GameConnect() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@hawaii.edu',
    games: ['Valorant', 'Overwatch 2', 'Apex Legends'],
    platforms: ['PC'],
    playstyle: 'Competitive',
    location: 'UH Mānoa Campus',
    bio: 'Looking for teammates to climb ranked! Available most evenings.',
    discord: 'JohnDoe#1234',
    notifications: true,
    avatar: '🎮'
  };

  const handleLogin = () => {
    setUser(mockUser);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const renderPage = () => {
    if (!user && currentPage !== 'landing') {
      return <LandingPage onLogin={handleLogin} />;
    }
    
    switch (currentPage) {
      case 'landing':
        return <LandingPage onLogin={handleLogin} />;
      case 'dashboard':
        return user ? <Dashboard user={user} onPageChange={handlePageChange} /> : <LandingPage onLogin={handleLogin} />;
      case 'players':
        return user ? <FindPlayers /> : <LandingPage onLogin={handleLogin} />;
      case 'events':
        return user ? <Events /> : <LandingPage onLogin={handleLogin} />;
      case 'profile':
        return user ? <Profile user={user} /> : <LandingPage onLogin={handleLogin} />;
      default:
        return user ? <Dashboard user={user} onPageChange={handlePageChange} /> : <LandingPage onLogin={handleLogin} />;
    }
  };

  if (!user && currentPage === 'landing') {
    return renderPage();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        user={user}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onToggleNotifications={handleToggleNotifications}
        onLogout={handleLogout}
      />
      <NotificationPanel show={showNotifications && !!user} />
      {renderPage()}
    </div>
  );
}
