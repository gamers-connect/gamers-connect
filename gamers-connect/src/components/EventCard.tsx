"use client";

import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

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

interface EventCardProps {
  event: GameEvent;
  isCompact?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, isCompact = false }) => {
  if (isCompact) {
    return (
      <div className="event-card-compact">
        <h4 className="event-title-compact">{event.title}</h4>
        <p className="event-meta-compact">{event.date} • {event.location}</p>
      </div>
    );
  }

  return (
    <div className="event-card">
      <div className="event-card-content">
        <div className="event-badges">
          <span className={`event-type event-type-${event.type.toLowerCase()}`}>
            {event.type}
          </span>
          <span className="event-game">
            {event.game}
          </span>
        </div>

        <h3 className="event-title">{event.title}</h3>
        
        <div className="event-details">
          <div className="event-detail-item">
            <Calendar className="event-icon" />
            <span className="event-detail-text">{event.date}</span>
          </div>
          <div className="event-detail-item">
            <Clock className="event-icon" />
            <span className="event-detail-text">{event.time}</span>
          </div>
          <div className="event-detail-item">
            <MapPin className="event-icon" />
            <span className="event-detail-text">{event.location}</span>
          </div>
          <div className="event-detail-item">
            <Users className="event-icon" />
            <span className="event-detail-text">{event.attendees}/{event.maxAttendees} attendees</span>
          </div>
        </div>

        <div className="event-actions">
          <button className="btn btn-primary btn-flex">
            Join Event
          </button>
          <button className="btn btn-outline btn-flex">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
