/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Calendar, Users, Trophy } from 'lucide-react';
import EventCard from '../../components/EventCard';
import { CreateEventModal } from '../../components/CreateEventModal'; 
import api from '@/lib/api';

// Enhanced GameEvent type to include new fields
interface GameEvent {
  id: number;
  title: string;
  description?: string;
  game: string;
  date: string;
  time: string;
  location: string;
  type: 'Tournament' | 'Meetup' | 'Contest' | 'Scrimmage';
  attendees: number;
  maxAttendees: number;
  website?: string;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<GameEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const games = ['Valorant', 'Overwatch 2', 'League of Legends', 'Apex Legends', 'Minecraft', 'Super Smash Bros', 'Rocket League', 'Among Us'];
  const eventTypes = ['Tournament', 'Meetup', 'Contest', 'Scrimmage'];

  // Fetch events
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const params: any = {
        upcoming: true,
        limit: 50
      };
      
      if (selectedGame) params.game = selectedGame;
      if (selectedType) params.type = selectedType;
      
      const response = await api.events.getAll(params);
      const eventsData = Array.isArray(response.events) ? response.events : [];
      
      // Transform the API response to match our GameEvent interface
      const transformedEvents: GameEvent[] = eventsData.map((event: any) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        game: event.game,
        date: event.date,
        time: event.time,
        location: event.location,
        type: event.type,
        attendees: event.attendees || 0, // Ensure attendees is always a number
        maxAttendees: event.maxAttendees,
        website: event.website
      }));
      
      setEvents(transformedEvents);
      setFilteredEvents(transformedEvents);
    } catch (err: any) {
      console.error('Failed to fetch events:', err);
      setError('Failed to load events');
      // Use mock data as fallback
      const mockEvents: GameEvent[] = [
        { id: 1, title: 'Valorant Tournament', description: 'Competitive tournament with prizes!', game: 'Valorant', date: '2025-08-15', time: '18:00', location: 'UH iLab', type: 'Tournament', attendees: 32, maxAttendees: 64, website: 'https://example.com' },
        { id: 2, title: 'Smash Bros Meetup', description: 'Casual gaming session for all skill levels', game: 'Super Smash Bros', date: '2025-08-10', time: '19:00', location: 'Campus Center', type: 'Meetup', attendees: 12, maxAttendees: 20 },
        { id: 3, title: 'Minecraft Build Contest', description: 'Show off your creativity in this building competition', game: 'Minecraft', date: '2025-08-20', time: '15:00', location: 'Online', type: 'Contest', attendees: 8, maxAttendees: 15 },
        { id: 4, title: 'Overwatch 2 Scrimmage', description: 'Practice matches before the big tournament', game: 'Overwatch 2', date: '2025-08-12', time: '20:00', location: 'Hamilton Library', type: 'Scrimmage', attendees: 18, maxAttendees: 24 }
      ];
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  }, [selectedType, selectedGame]);

  useEffect(() => {
    fetchEvents();
  }, [selectedGame, selectedType, fetchEvents]);

  // Filter events based on search term
  useEffect(() => {
    let filtered = events;
    
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredEvents(filtered);
  }, [events, searchTerm]);

  const handleEventCreated = () => {
    fetchEvents(); // Refresh the events list
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGame('');
    setSelectedType('');
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ textAlign: 'center', color: 'white', padding: '4rem 0' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎮</div>
          <div>Loading events...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
          🎮 Gaming Events
        </h1>
        <p style={{ color: '#d1d5db', fontSize: '1.125rem' }}>
          Discover tournaments, meetups, and gaming events at UH
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Calendar size={20} color="#3b82f6" />
            <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>Total Events</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{events.length}</div>
        </div>

        <div style={{
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Users size={20} color="#22c55e" />
            <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>Total Spots</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {events.reduce((sum, event) => sum + event.maxAttendees, 0)}
          </div>
        </div>

        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Trophy size={20} color="#f59e0b" />
            <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>Tournaments</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {events.filter(event => event.type === 'Tournament').length}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          {/* Search */}
          <div style={{ position: 'relative', minWidth: '250px' }}>
            <Search 
              size={18} 
              style={{ 
                position: 'absolute', 
                left: '0.75rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#9ca3af' 
              }} 
            />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.5rem',
                color: 'white',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Filters */}
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            style={{
              padding: '0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              color: 'white',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          >
            <option value="">All Games</option>
            {games.map(game => (
              <option key={game} value={game} style={{ color: 'black' }}>{game}</option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{
              padding: '0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              color: 'white',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          >
            <option value="">All Types</option>
            {eventTypes.map(type => (
              <option key={type} value={type} style={{ color: 'black' }}>{type}</option>
            ))}
          </select>

          {(searchTerm || selectedGame || selectedType) && (
            <button
              onClick={clearFilters}
              style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.5rem',
                color: 'white',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Create Event Button */}
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            color: 'white',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.875rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
          }}
        >
          <Plus size={18} />
          Create Event
        </button>
      </div>

      {/* Events Grid */}
      {error && !events.length ? (
        <div style={{
          textAlign: 'center',
          color: '#ef4444',
          padding: '2rem',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '0.75rem',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
          <div>{error}</div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div style={{
          textAlign: 'center',
          color: 'white',
          padding: '4rem 2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '0.75rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎮</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            No events found
          </h3>
          <p style={{ color: '#d1d5db', marginBottom: '2rem' }}>
            {searchTerm || selectedGame || selectedType
              ? 'Try adjusting your filters to see more events'
              : 'Be the first to create an event for the community!'
            }
          </p>
          {!searchTerm && !selectedGame && !selectedType && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Create First Event
            </button>
          )}
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {filteredEvents.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              onUpdate={fetchEvents}
            />
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onEventCreated={handleEventCreated}
      />
    </div>
  );
};

export default Events;
