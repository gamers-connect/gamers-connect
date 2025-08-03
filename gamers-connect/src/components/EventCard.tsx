/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Clock, MapPin, Users, Globe, X, ExternalLink } from 'lucide-react';
import { GameEvent } from '../app/types';
import api from '../lib/api';

interface EventCardProps {
  event: GameEvent;
  isCompact?: boolean;
  onUpdate?: () => Promise<void>;
}

interface EventDetailsModalProps {
  event: GameEvent;
  isOpen: boolean;
  onClose: () => void;
  onJoin: () => void;
  isJoining: boolean;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ 
  event, 
  isOpen, 
  onClose, 
  onJoin, 
  isJoining 
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'tournament': return '#ef4444';
      case 'meetup': return '#3b82f6';
      case 'contest': return '#f59e0b';
      case 'scrimmage': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${getEventTypeColor(event.type)}, ${getEventTypeColor(event.type)}dd)`,
          color: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem 0.75rem 0 0',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '2rem',
              height: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            <X size={16} />
          </button>
          
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              {event.type}
            </span>
          </div>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
            {event.title}
          </h2>
          
          <p style={{ fontSize: '1rem', opacity: 0.9, margin: '0.5rem 0 0 0' }}>
            🎮 {event.game}
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* Event Details */}
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Calendar size={18} color="#6b7280" />
              <div>
                <div style={{ fontWeight: '500', color: '#374151' }}>
                  {formatDate(event.date)}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Date
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock size={18} color="#6b7280" />
              <div>
                <div style={{ fontWeight: '500', color: '#374151' }}>
                  {event.time}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Time
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MapPin size={18} color="#6b7280" />
              <div>
                <div style={{ fontWeight: '500', color: '#374151' }}>
                  {event.location}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Location
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Users size={18} color="#6b7280" />
              <div>
                <div style={{ fontWeight: '500', color: '#374151' }}>
                  {event.attendees} / {event.maxAttendees} players
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Attendees
                </div>
              </div>
            </div>

            {/* Website link if available */}
            {(event as any).website && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Globe size={18} color="#6b7280" />
                <div>
                  <a
                    href={(event as any).website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#3b82f6',
                      textDecoration: 'none',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    Visit Website
                    <ExternalLink size={14} />
                  </a>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Event Website
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description if available */}
          {(event as any).description && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Description
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.5' }}>
                {(event as any).description}
              </p>
            </div>
          )}

          {/* Progress Bar */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Registration Progress
              </span>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {Math.round((event.attendees / event.maxAttendees) * 100)}% full
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '0.5rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(event.attendees / event.maxAttendees) * 100}%`,
                height: '100%',
                backgroundColor: getEventTypeColor(event.type),
                borderRadius: '9999px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onJoin}
            disabled={isJoining || event.attendees >= event.maxAttendees}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: event.attendees >= event.maxAttendees ? '#9ca3af' : getEventTypeColor(event.type),
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: (isJoining || event.attendees >= event.maxAttendees) ? 'not-allowed' : 'pointer',
              opacity: (isJoining || event.attendees >= event.maxAttendees) ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {isJoining ? 'Joining...' : 
             event.attendees >= event.maxAttendees ? 'Event Full' : 
             'Join Event'}
          </button>
        </div>
      </div>
    </div>
  );
};

const EventCard: React.FC<EventCardProps> = ({ event, isCompact = false, onUpdate }) => {
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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
      
      // Close details modal after joining
      setShowDetails(false);
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
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
      onClick={() => setShowDetails(true)}
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
        
        <EventDetailsModal
          event={event}
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          onJoin={handleJoinEvent}
          isJoining={isJoining}
        />
      </div>
    );
  }

  return (
    <>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        transition: 'all 0.3s ease',
        color: 'white',
        cursor: 'pointer'
      }}
      onClick={() => setShowDetails(true)}
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
        
        <p style={{ color: '#d1d5db', marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>🎮 {event.game}</p>
        <p style={{ color: '#d1d5db', fontSize: '0.875rem', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
          📅 {event.date} at {event.time} • 📍 {event.location}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#d1d5db', fontSize: '0.875rem' }}>
            👥 {event.attendees}/{event.maxAttendees} attendees
          </span>
          <span style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            View Details
          </span>
        </div>
      </div>
      
      <EventDetailsModal
        event={event}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        onJoin={handleJoinEvent}
        isJoining={isJoining}
      />
    </>
  );
};

export default EventCard;
