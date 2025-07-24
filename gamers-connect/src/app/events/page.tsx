"use client";

import React from 'react';
import { Plus } from 'lucide-react';
import EventCard from '../../components/EventCard';

// Mock data
const mockEvents = [
  { id: 1, title: 'Valorant Tournament', game: 'Valorant', date: '2025-07-25', time: '18:00', location: 'UH iLab', type: 'Tournament' as const, attendees: 32, maxAttendees: 64 },
  { id: 2, title: 'Smash Bros Meetup', game: 'Super Smash Bros', date: '2025-07-22', time: '19:00', location: 'Campus Center', type: 'Meetup' as const, attendees: 12, maxAttendees: 20 },
  { id: 3, title: 'Minecraft Build Contest', game: 'Minecraft', date: '2025-07-28', time: '15:00', location: 'Online', type: 'Contest' as const, attendees: 8, maxAttendees: 15 },
  { id: 4, title: 'Overwatch 2 Scrimmage', game: 'Overwatch 2', date: '2025-07-24', time: '20:00', location: 'Hamilton Library', type: 'Scrimmage' as const, attendees: 18, maxAttendees: 24 }
];

const Events: React.FC = () => (
  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
        Gaming Events
      </h2>
      <p style={{ color: '#d1d5db' }}>Discover tournaments, meetups, and gaming events at UH</p>
    </div>

    <div style={{ marginBottom: '1.5rem' }}>
      <button style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      }}>
        <Plus style={{ height: '1rem', width: '1rem' }} />
        <span>Create Event</span>
      </button>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      {mockEvents.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  </div>
);

export default Events;
