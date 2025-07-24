"use client";

import React, { useState } from 'react';
import { Gamepad2, Users, Calendar, Trophy, Plus, MessageCircle } from 'lucide-react';
import Navigation from '../components/Navigation';
import PlayerCard from '../components/PlayerCard';
import EventCard from '../components/EventCard';
import QuickActions from '../components/QuickActions';
import FilterBar from '../components/FilterBar';
import NotificationPanel from '../components/NotificationPanel';

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
  <div className="landing-hero">
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Gamepad2 style={{ height: '2rem', width: '2rem', color: '#9ca3af' }} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Game Connect</h1>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          onClick={onLogin}
          className="btn btn-secondary"
          style={{ 
            backgroundColor: 'transparent', 
            border: '1px solid white',
            color: 'white',
            padding: '0.5rem 1.5rem'
          }}
        >
          Login
        </button>
        <button 
          onClick={onLogin}
          className="btn"
          style={{ 
            backgroundColor: '#d1d5db', 
            color: 'black',
            padding: '0.5rem 1.5rem',
            fontWeight: '600'
          }}
        >
          Sign Up
        </button>
      </div>
    </nav>

    <div className="hero-content">
      <h2 className="hero-title">
        Connect. Play. Compete.
      </h2>
      <p className="hero-subtitle">
        The ultimate gaming community for University of Hawaiʻi students. Find teammates, 
        join tournaments, and discover gaming events right here on campus.
      </p>
      
      <div className="features-grid">
        <div className="feature-card">
          <Users style={{ height: '3rem', width: '3rem', color: '#9ca3af', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Find Teammates</h3>
          <p style={{ color: '#d1d5db' }}>Connect with fellow UH gamers who share your interests and playstyle</p>
        </div>
        
        <div className="feature-card">
          <Calendar style={{ height: '3rem', width: '3rem', color: '#9ca3af', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Join Events</h3>
          <p style={{ color: '#d1d5db' }}>Discover tournaments, meetups, and gaming events happening on campus</p>
        </div>
        
        <div className="feature-card">
          <Trophy style={{ height: '3rem', width: '3rem', color: '#9ca3af', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Compete</h3>
          <p style={{ color: '#d1d5db' }}>Participate in tournaments and showcase your gaming skills</p>
        </div>
      </div>

      <button 
        onClick={onLogin}
        className="btn"
        style={{ 
          marginTop: '3rem',
          padding: '1rem 2rem',
          background: 'linear-gradient(to right, #d1d5db, #ffffff)',
          color: 'black',
          fontSize: '1.125rem',
          fontWeight: 'bold',
          transform: 'scale(1)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.background = 'linear-gradient(to right, #9ca3af, #e5e7eb)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.background = 'linear-gradient(to right, #d1d5db, #ffffff)';
        }}
      >
        Get Started Today
      </button>
    </div>
  </div>
);

// Dashboard Component
const Dashboard: React.FC<{ user: User; onPageChange: (page: string) => void }> = ({ user, onPageChange }) => (
  <div className="container" style={{ padding: '2rem 0' }}>
    <div className="mb-8">
      <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
        Welcome back, {user.name}!
      </h2>
      <p style={{ color: '#4b5563' }}>Here&apos;s what&apos;s happening in your gaming community</p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="card card-padding">
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Users style={{ height: '1.25rem', width: '1.25rem', color: 'black' }} />
            Recommended Players
          </h3>
          <div className="grid-2">
            {mockPlayers.slice(0, 4).map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </div>

        <div className="card card-padding">
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Gamepad2 style={{ height: '1.25rem', width: '1.25rem', color: 'black' }} />
            Your Gaming Sessions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mockSessions.map(session => (
              <div key={session.id} style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: '0.5rem', 
                padding: '1rem' 
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '0.5rem'
                }}>
                  <h4 style={{ fontWeight: '600' }}>{session.title}</h4>
                  <span style={{ 
                    fontSize: '0.75rem',
                    backgroundColor: '#f3f4f6',
                    color: '#1f2937',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '9999px'
                  }}>
                    {session.game}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.5rem' }}>
                  Hosted by {session.host}
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  <span>{session.date} at {session.time}</span>
                  <span>{session.players}/{session.maxPlayers} players</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <QuickActions onFindPlayers={() => onPageChange('players')} />

        <div className="card card-padding">
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Calendar style={{ height: '1rem', width: '1rem', color: 'black' }} />
            Upcoming Events
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {mockEvents.slice(0, 3).map(event => (
              <EventCard key={event.id} event={event} isCompact />
            ))}
          </div>
          <button 
            onClick={() => onPageChange('events')}
            className="btn"
            style={{ 
              width: '100%',
              marginTop: '1rem',
              backgroundColor: 'transparent',
              color: 'black',
              padding: '0.5rem',
              fontSize: '0.875rem'
            }}
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
    <div className="container" style={{ padding: '2rem 0' }}>
      <div className="mb-8">
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
          Find Players
        </h2>
        <p style={{ color: '#4b5563' }}>Connect with fellow UH gamers who share your interests</p>
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

      <div className="grid-3">
        {mockPlayers.map(player => (
          <PlayerCard key={player.id} player={player} showRating isDetailed />
        ))}
      </div>
    </div>
  );
};

// Events Component
const Events: React.FC = () => (
  <div className="container" style={{ padding: '2rem 0' }}>
    <div className="mb-8">
      <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
        Gaming Events
      </h2>
      <p style={{ color: '#4b5563' }}>Discover tournaments, meetups, and gaming events at UH</p>
    </div>

    <div className="mb-6">
      <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Plus style={{ height: '1rem', width: '1rem' }} />
        <span>Create Event</span>
      </button>
    </div>

    <div className="grid-2">
      {mockEvents.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  </div>
);

// Profile Component
const Profile: React.FC<{ user: User }> = ({ user }) => (
  <div className="container" style={{ padding: '2rem 0' }}>
    <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ 
          background: 'linear-gradient(to right, #374151, #000000)',
          padding: '2rem 1.5rem',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ 
              width: '6rem',
              height: '6rem',
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.25rem'
            }}>
              {user.avatar}
            </div>
            <div>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>{user.name}</h2>
              <p style={{ color: '#e5e7eb' }}>{user.email}</p>
              <p style={{ color: '#e5e7eb' }}>{user.location}</p>
            </div>
          </div>
        </div>

        <div className="card-padding">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                  Gaming Preferences
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Favorite Games
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {user.games.map(game => (
                        <span key={game} style={{ 
                          backgroundColor: '#f3f4f6',
                          color: '#1f2937',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.875rem'
                        }}>
                          {game}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Platforms
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {user.platforms.map(platform => (
                        <span key={platform} style={{ 
                          backgroundColor: '#e5e7eb',
                          color: '#1f2937',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.875rem'
                        }}>
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Playstyle
                    </label>
                    <span style={{ 
                      backgroundColor: '#d1d5db',
                      color: '#1f2937',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem'
                    }}>
                      {user.playstyle}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem' }}>Bio</h3>
                <p style={{ color: '#4b5563' }}>{user.bio}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem' }}>Contact Info</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageCircle style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                    <span style={{ fontSize: '0.875rem' }}>Discord: {user.discord}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem' }}>Settings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem' }}>Notifications</span>
                    <button style={{ 
                      width: '3rem',
                      height: '1.5rem',
                      borderRadius: '9999px',
                      backgroundColor: user.notifications ? '#000' : '#d1d5db',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s ease'
                    }}>
                      <div style={{ 
                        width: '1.25rem',
                        height: '1.25rem',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '0.125rem',
                        left: user.notifications ? '1.5rem' : '0.25rem',
                        transition: 'all 0.2s ease'
                      }}></div>
                    </button>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
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
