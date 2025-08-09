/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import { Users, Gamepad2, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PlayerCard from '../../components/PlayerCard';
import EventCard from '../../components/EventCard';
import QuickActions from '../../components/QuickActions';
import { useAuth } from '../../contexts/AuthContext';
import api, { UserProfile, Event, Session} from '../../lib/api';
import SessionCreationModel from '../../components/SessionCreationModel';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [recommendedPlayers, setRecommendedPlayers] = useState<UserProfile[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [userSessions, setUserSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

useEffect(() => {
  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const [
        playersResponse,
        eventsResponse,
        sessionsResponse
      ] = await Promise.all([
        api.users.getAll({
          limit: 4,
          game: user.games?.[0],
        }),
        api.events.getAll({
          upcoming: true,
          limit: 3,
        }),
        api.sessions.getAll({
          userId: user.id,
          limit: 2,
        })
      ]);

      setRecommendedPlayers(
        playersResponse.users.filter(p => p.id !== user.id)
      );
      setUpcomingEvents(eventsResponse.events);
      setUserSessions(sessionsResponse.sessions);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, [user]);

  const handleFindPlayers = () => {
    router.push('/players');
  };

  const handleViewEvents = () => {
    router.push('/events');
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const showSuccessToast = (message: string) => {
    toast.success(message);
  };

  const handleCreateSession = async () => {
    //refresh session list
    try {
      const sessionsResponse = await api.sessions.getAll({
        userId: user?.id,
        limit: 2,
      });
      setUserSessions(sessionsResponse.sessions);
    } catch (err) {
      console.error('Failed to refresh sessions:', err);
    }

    //show notification
    showSuccessToast("Session created successfully!");
  };

  const handleEventUpdate = async () => {
    // Refresh events data when user joins/leaves an event
    try {
      const eventsResponse = await api.events.getAll({
        upcoming: true,
        limit: 3,
      });
      setUpcomingEvents(eventsResponse.events);
    } catch (error) {
      console.error('Error refreshing events:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '2rem 1.5rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh'
      }}>
        <div style={{ color: 'white', fontSize: '1.2rem' }}>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '2rem 1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ color: '#ef4444', fontSize: '1.1rem' }}>{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
          Welcome back, {user?.name}!
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
              {user?.games?.[0] && (
                <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                  ({user.games[0]} players)
                </span>
              )}
            </h3>
            {recommendedPlayers.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {recommendedPlayers.slice(0, 4).map((player: any) => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>
                <Users style={{ height: '3rem', width: '3rem', margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>No players found matching your games.</p>
                <p style={{ fontSize: '0.875rem' }}>Try updating your game preferences!</p>
              </div>
            )}
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
            {userSessions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {userSessions.map((session: any) => (
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
                      Hosted by {session.host.name}
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      fontSize: '0.875rem',
                      color: '#d1d5db'
                    }}>
                      <span>{new Date(session.date).toLocaleDateString()} at {session.time}</span>
                      <span>{session.memberCount}/{session.maxPlayers} players</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>
                <Gamepad2 style={{ height: '3rem', width: '3rem', margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>No active gaming sessions.</p>
                <p style={{ fontSize: '0.875rem' }}>Create one to get started!</p>
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <QuickActions 
            onFindPlayers={handleFindPlayers}
            onCreateSession={handleOpenModal}
          />
          <SessionCreationModel 
            isOpen={isModalOpen} 
            onClose={handleCloseModal} 
            onCreateSession={handleCreateSession}
          />
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
            {upcomingEvents.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {upcomingEvents.slice(0, 3).map((event: any) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    isCompact 
                    onUpdate={handleEventUpdate}
                  />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#9ca3af', padding: '1rem' }}>
                <Calendar style={{ height: '2rem', width: '2rem', margin: '0 auto 0.5rem', opacity: 0.5 }} />
                <p style={{ fontSize: '0.875rem' }}>No upcoming events.</p>
              </div>
            )}
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
            {/* THIS IS THE TEST BUTTON TO SEE THE NOTIFICATION */}
            {/*
            <button
              onClick={() => toast.success('good ol test notification')}
              style={{
                marginTop: '2rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#10b981',
                color: 'white',
                fontSize: '0.875rem'
              }}
            >
              Show Test Toast
            </button>
            */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;