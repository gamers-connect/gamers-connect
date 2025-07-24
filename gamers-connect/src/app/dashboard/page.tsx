"use client";

import React from 'react';
import { Users, Gamepad2, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PlayerCard from '../../components/PlayerCard';
import EventCard from '../../components/EventCard';
import QuickActions from '../../components/QuickActions';

// Mock data - move this to a separate file later if needed
const mockPlayers = [
  { id: 1, name: 'Alex Chen', games: ['Valorant', 'Overwatch 2'], platform: 'PC', playstyle: 'Competitive', location: 'UH Mānoa Campus', status: 'online' as const, rating: 4.8 },
  { id: 2, name: 'Sarah Kim', games: ['Super Smash Bros', 'Minecraft'], platform: 'Nintendo Switch', playstyle: 'Casual', location: 'UH Mānoa Campus', status: 'online' as const, rating: 4.9 },
  { id: 3, name: 'Marcus Johnson', games: ['Apex Legends', 'Rocket League'], platform: 'PC', playstyle: 'Competitive', location: 'UH West Oahu', status: 'away' as const, rating: 4.7 },
  { id: 4, name: 'Luna Patel', games: ['League of Legends', 'Valorant'], platform: 'PC', playstyle: 'Competitive', location: 'UH Mānoa Campus', status: 'online' as const, rating: 4.6 }
];

const mockEvents = [
  { id: 1, title: 'Valorant Tournament', game: 'Valorant', date: '2025-07-25', time: '18:00', location: 'UH iLab', type: 'Tournament' as const, attendees: 32, maxAttendees: 64 },
  { id: 2, title: 'Smash Bros Meetup', game: 'Super Smash Bros', date: '2025-07-22', time: '19:00', location: 'Campus Center', type: 'Meetup' as const, attendees: 12, maxAttendees: 20 },
  { id: 3, title: 'Minecraft Build Contest', game: 'Minecraft', date: '2025-07-28', time: '15:00', location: 'Online', type: 'Contest' as const, attendees: 8, maxAttendees: 15 }
];

const mockSessions = [
  { id: 1, title: 'Ranked Valorant Grind', game: 'Valorant', host: 'Alex Chen', date: '2025-07-20', time: '21:00', players: 3, maxPlayers: 5 },
  { id: 2, title: 'Chill Minecraft Building', game: 'Minecraft', host: 'Sarah Kim', date: '2025-07-21', time: '16:00', players: 2, maxPlayers: 6 }
];

// Mock user
const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@hawaii.edu'
};

const Dashboard: React.FC = () => {
  const router = useRouter();

  const handleFindPlayers = () => {
    router.push('/players');
  };

  const handleViewEvents = () => {
    router.push('/events');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
          Welcome back, {mockUser.name}!
        </h2>
        <p style={{ color: '#d1d5db' }}>Here&apos;s what&apos;s happening in your gaming community</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Recommended Players Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            color: 'white'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Users style={{ height: '1.25rem', width: '1.25rem', color: 'white' }} />
              Recommended Players
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {mockPlayers.slice(0, 4).map(player => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </div>

          {/* Gaming Sessions Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            color: 'white'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Gamepad2 style={{ height: '1.25rem', width: '1.25rem', color: 'white' }} />
              Your Gaming Sessions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {mockSessions.map(session => (
                <div key={session.id} style={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.5rem', 
                  padding: '1rem' 
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <h4 style={{ fontWeight: '600', color: 'white' }}>{session.title}</h4>
                    <span style={{ 
                      fontSize: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px'
                    }}>
                      {session.game}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#d1d5db', marginBottom: '0.5rem' }}>
                    Hosted by {session.host}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '0.875rem',
                    color: '#d1d5db'
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
          <QuickActions onFindPlayers={handleFindPlayers} />

          {/* Upcoming Events Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            color: 'white'
          }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Calendar style={{ height: '1rem', width: '1rem', color: 'white' }} />
              Upcoming Events
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {mockEvents.slice(0, 3).map(event => (
                <EventCard key={event.id} event={event} isCompact />
              ))}
            </div>
            <button 
              onClick={handleViewEvents}
              style={{ 
                width: '100%',
                marginTop: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '0.5rem',
                fontSize: '0.875rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              View All Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
