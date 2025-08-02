/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { X, Lock, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface SessionCreationModelProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSession: (session: unknown) => void;
}

const SessionCreationModel: React.FC<SessionCreationModelProps> = ({ 
  isOpen, 
  onClose, 
  onCreateSession 
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [sessionData, setSessionData] = useState({
    title: '',
    game: '',
    description: '',
    date: '',
    time: '',
    maxPlayers: 4,
    isPrivate: false,
    platform: '',
    skillLevel: 'Any'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const games = ['Valorant', 'Overwatch 2', 'League of Legends', 'Apex Legends', 'Minecraft'];
  const platforms = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Any'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create a session');
      return;
    }

    const requiredFields = ['title', 'game', 'platform', 'date', 'time'];
    const missing = requiredFields.filter(field => !sessionData[field as keyof typeof sessionData]);

    if (missing.length > 0) {
      setError('Please fill in the required fields:');
      setMissingFields(missing); 
      return;
    }

    setMissingFields([]);
    setLoading(true);
    setError('');

    try {
      const newSessionData = {
        title: sessionData.title,
        game: sessionData.game,
        description: sessionData.description,
        date: sessionData.date,
        time: sessionData.time,
        maxPlayers: sessionData.maxPlayers,
        isPrivate: sessionData.isPrivate,
        platform: sessionData.platform,
        skillLevel: sessionData.skillLevel,
        hostId: user.id // Add hostId from authenticated user
      };

      // Fix: Use the correct API method signature from your api.ts
      const response = await api.sessions.create(newSessionData);
      
      // Call the onCreateSession callback with the created session
      onCreateSession(response);
      
      // Reset form
      setSessionData({
        title: '',
        game: '',
        description: '',
        date: '',
        time: '',
        maxPlayers: 4,
        isPrivate: false,
        platform: '',
        skillLevel: 'Any'
      });
      
      // Close the modal
      onClose();
      
      // Optionally redirect to the new session page
      // router.push(`/sessions/${response.id}`);
    } catch (err: any) {
      console.error('Failed to create session:', err);
      setError(err.message || 'Failed to create session. Please try again.');
      toast.error('Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setSessionData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        maxWidth: '32rem',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ padding: '1.5rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              Create Gaming Session
            </h2>
            <button 
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                color: '#9ca3af'
              }}
            >
              <X style={{ height: '1.5rem', width: '1.5rem' }} />
            </button>
          </div>

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

          <div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151' 
              }}>
                Session Title *
              </label>
              <input
                type="text"
                required
                value={sessionData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: missingFields.includes('title') ? '2px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
                placeholder="e.g., Ranked Valorant Grind"
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Game *
                </label>
                <select
                  required
                  value={sessionData.game}
                  onChange={(e) => handleChange('game', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: missingFields.includes('game') ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <option value="">Select a game</option>
                  {games.map(game => (
                    <option key={game} value={game}>{game}</option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Platform *
                </label>
                <select
                  required
                  value={sessionData.platform}
                  onChange={(e) => handleChange('platform', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: missingFields.includes('platform') ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <option value="">Select platform</option>
                  {platforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={sessionData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: missingFields.includes('date') ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Time *
                </label>
                <input
                  type="time"
                  required
                  value={sessionData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: missingFields.includes('time') ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Max Players
                </label>
                <input
                  type="number"
                  min="2"
                  max="20"
                  value={sessionData.maxPlayers}
                  onChange={(e) => handleChange('maxPlayers', parseInt(e.target.value) || 4)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151' 
              }}>
                Skill Level
              </label>
              <select
                value={sessionData.skillLevel}
                onChange={(e) => handleChange('skillLevel', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
              >
                {skillLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151' 
              }}>
                Description
              </label>
              <textarea
                rows={3}
                value={sessionData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                placeholder="Tell other players what to expect..."
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  id="private"
                  checked={sessionData.isPrivate}
                  onChange={(e) => handleChange('isPrivate', e.target.checked)}
                  style={{ 
                    height: '1rem', 
                    width: '1rem', 
                    borderRadius: '0.25rem', 
                    border: '1px solid #d1d5db', 
                    color: '#3b82f6', 
                    marginRight: '0.75rem' 
                  }}
                />
                <label htmlFor="private" style={{ display: 'flex', alignItems: 'center', color: '#374151' }}>
                  {sessionData.isPrivate ? 
                    <Lock style={{ height: '1rem', width: '1rem', marginRight: '0.5rem', color: '#6b7280' }} /> : 
                    <Globe style={{ height: '1rem', width: '1rem', marginRight: '0.5rem', color: '#6b7280' }} />
                  }
                  <span>{sessionData.isPrivate ? 'Private Session' : 'Public Session'}</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                Cancel
              </button>
              <button
                type="button" // Changed from "submit" to "button" since we're handling submit in the form onSubmit
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Creating...' : 'Create Session'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCreationModel;
