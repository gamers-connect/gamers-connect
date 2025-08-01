"use client";

import React, { useState } from 'react';
import { Plus, Gamepad2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

interface AvailabilityPost {
  id: string;
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
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [postData, setPostData] = useState({
    game: '',
    message: '',
    duration: '1-2 hours'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const games = ['Valorant', 'Overwatch 2', 'League of Legends', 'Apex Legends', 'Minecraft', 'Any Game'];
  const durations = ['30 minutes', '1-2 hours', '2-4 hours', 'All day', 'Open-ended'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to post availability');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create the post data for the API
      const postPayload = {
        game: postData.game,
        message: postData.message,
        duration: postData.duration
      };

      // Call the API to create the availability post
      const response = await api.availability.create(postPayload);
      
      // Create the local post object to pass to the parent component
      const newPost: AvailabilityPost = {
        id: response.id,
        ...postData,
        timestamp: response.timestamp || new Date().toISOString(),
        user: user.name
      };
      
      // Notify the parent component
      onPostAvailability(newPost);
      
      // Reset the form
      setPostData({ game: '', message: '', duration: '1-2 hours' });
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to post availability:', err);
      setError('Failed to post availability. Please try again.');
    } finally {
      setLoading(false);
    }
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
    <div style={{ 
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }}>
      <h3 style={{ 
        fontSize: '1.125rem', 
        fontWeight: '600', 
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#1f2937'
      }}>
        <Gamepad2 style={{ height: '1.25rem', width: '1.25rem' }} />
        Post Your Gaming Availability
      </h3>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#ef4444',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

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
              padding: '0.75rem',
              fontSize: '0.875rem',
              backgroundColor: 'white'
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
              padding: '0.75rem',
              fontSize: '0.875rem',
              backgroundColor: 'white'
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
              padding: '0.75rem',
              fontSize: '0.875rem',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            placeholder="e.g., Looking for ranked teammates, casual play, or just want to have fun!"
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Posting...' : 'Post Availability'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AvailabilityPoster;
