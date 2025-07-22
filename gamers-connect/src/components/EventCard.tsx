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

export const EventCard: React.FC<EventCardProps> = ({ event, isCompact = false }) => {
  if (isCompact) {
    return (
      <div className="border-l-4 border-black pl-3 py-2">
        <h4 className="font-medium text-sm">{event.title}</h4>
        <p className="text-xs text-gray-600">{event.date} • {event.location}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 text-sm rounded-full ${
            event.type === 'Tournament' ? 'bg-gray-800 text-white' :
            event.type === 'Meetup' ? 'bg-gray-600 text-white' :
            event.type === 'Contest' ? 'bg-gray-700 text-white' :
            'bg-gray-500 text-white'
          }`}>
            {event.type}
          </span>
          <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
            {event.game}
          </span>
        </div>

        <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{event.date}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{event.time}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{event.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="h-4 w-4" />
            <span className="text-sm">{event.attendees}/{event.maxAttendees} attendees</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Join Event
          </button>
          <button className="flex-1 border border-black text-black py-2 rounded-lg hover:bg-gray-50 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
