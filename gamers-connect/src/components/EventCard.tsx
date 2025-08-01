"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GameEvent } from '../app/types';
import api from '../lib/api';

interface EventCardProps {
  event: GameEvent;
  isCompact?: boolean;
  onUpdate?: () => Promise<void>;
}

const EventCard: React.FC<EventCardProps> = ({ event, isCompact = false, onUpdate }) => {
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinEvent = async () => {
    if (!user) {
      console.log('User must be logged in to join event');
      return;
    }

    setIsJoining(true);
    try {
      await api.events.join(event.id.toString(), user.id);
      
      console.log('Successfully joined event:', event.id);
      
      if (onUpdate) {
        await onUpdate();
      }
    } catch (error) {
      console.error('Failed to join event:', error);
    } finally {
      setIsJoining(false);
    }
  };

  if (isCompact) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '0.5rem',
        padding: '1rem',
        color: 'white',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
      }}>
        <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.875rem' }}>{event.title}</h4>
        <p style={{ fontSize: '0.75rem', color: '#d1d5db', margin: 0 }}>
          {event.date} • {event.location}
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      transition: 'all 0.3s ease',
      color: 'white'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>{event.title}</h3>
        <span style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '500'
        }}>
          {event.type}
        </span>
      </div>
      
      <p style={{ color: '#d1d5db', marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>{event.game}</p>
      <p style={{ color: '#d1d5db', fontSize: '0.875rem', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
        {event.date} at {event.time} • {event.location}
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#d1d5db', fontSize: '0.875rem' }}>
          {event.attendees}/{event.maxAttendees} attendees
        </span>
        <button 
          onClick={handleJoinEvent}
          disabled={isJoining}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '0.5rem',
            cursor: isJoining ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            opacity: isJoining ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!isJoining) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isJoining) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }
          }}>
          {isJoining ? 'Joining...' : 'Join Event'}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
