"use client";

import React, { useState } from 'react';
import { Plus, Gamepad2 } from 'lucide-react';

interface AvailabilityPost {
  id: number;
  game: string;
  message: string;
  duration: string;
  timestamp: string;
  user: string;
}

interface AvailabilityPosterProps {
  onPostAvailability: (post: AvailabilityPost) => void;
}

const AvailabilityPoster: React.FC<AvailabilityPosterProps> = ({ onPostAvailability }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [postData, setPostData] = useState({
    game: '',
    message: '',
    duration: '1-2 hours'
  });

  const games = ['Valorant', 'Overwatch 2', 'League of Legends', 'Apex Legends', 'Minecraft', 'Any Game'];
  const durations = ['30 minutes', '1-2 hours', '2-4 hours', 'All day', 'Open-ended'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: AvailabilityPost = {
      id: Date.now(),
      ...postData,
      timestamp: new Date().toISOString(),
      user: 'Current User'
    };
    onPostAvailability(newPost);
    setPostData({ game: '', message: '', duration: '1-2 hours' });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          width: '100%',
          backgroundColor: '#f9fafb',
          border: '2px dashed #d1d5db',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#9ca3af';
          e.currentTarget.style.backgroundColor = '#f3f4f6';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#d1d5db';
          e.currentTarget.style.backgroundColor = '#f9fafb';
        }}
      >
        <Plus style={{ height: '2rem', width: '2rem', margin: '0 auto 0.5rem', color: '#9ca3af' }} />
        <p style={{ color: '#4b5563', fontWeight: '500' }}>Post Your Availability</p>
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Let others know you are looking to play</p>
      </button>
    );
  }

  return (
    <div className="card card-padding" style={{ border: '2px solid black' }}>
      <h3 style={{ 
        fontSize: '1.125rem', 
        fontWeight: '600', 
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <Gamepad2 style={{ height: '1.25rem', width: '1.25rem' }} />
        Post Your Gaming Availability
      </h3>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            What game are you looking to play?
          </label>
          <select
            required
            value={postData.game}
            onChange={(e) => setPostData({ ...postData, game: e.target.value })}
            style={{
              width: '100%',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem'
            }}
          >
            <option value="">Select a game</option>
            {games.map(game => (
              <option key={game} value={game}>{game}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            How long are you available?
          </label>
          <select
            value={postData.duration}
            onChange={(e) => setPostData({ ...postData, duration: e.target.value })}
            style={{
              width: '100%',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem'
            }}
          >
            {durations.map(duration => (
              <option key={duration} value={duration}>{duration}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Message (optional)
          </label>
          <textarea
            rows={3}
            value={postData.message}
            onChange={(e) => setPostData({ ...postData, message: e.target.value })}
            style={{
              width: '100%',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              resize: 'vertical'
            }}
            placeholder="e.g., Looking for ranked teammates, casual play, or just want to have fun!"
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="btn btn-secondary"
            style={{ flex: 1, padding: '0.5rem' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ flex: 1, padding: '0.5rem' }}
          >
            Post Availability
          </button>
        </div>
      </form>
    </div>
  );
};

export default AvailabilityPoster;
