"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Player } from '../app/types';
import api from '../lib/api';

interface PlayerCardProps {
  player: Player;
  showRating?: boolean;
  isDetailed?: boolean;
  onUpdate?: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  showRating = false,
  onUpdate // Destructure onUpdate
}) => {
  const { user } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleConnect = async () => {
    if (!user) return;
    
    setIsConnecting(true);
    setRequestSent(false);
    setStatusMessage(null);

    try {
      await api.connections.send(user.id, String(player.id), `Hi ${player.name}! I'd like to connect and play together.`);
      
      setRequestSent(true);
      setStatusMessage(`Friend request sent to ${player.name}!`);

      // Optionally trigger a refresh in the parent component
      if (onUpdate) {
        onUpdate();
      }

      setTimeout(() => setStatusMessage(null), 5000);

      // Show success feedback (you might want to use a toast notification here)
      console.log(`Connection request sent to ${player.name}`);
      
    } catch (error) {
      console.error('Failed to send connection request:', error);
      setRequestSent(false);
      setStatusMessage('Failed to send friend request.');
      setTimeout(() => setStatusMessage(null), 5000);
      // Show error feedback
    } finally {
      setIsConnecting(false);
    }
  };

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>{player.name}</h3>
        <span style={{
          backgroundColor: player.status === 'online' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(156, 163, 175, 0.2)',
          color: player.status === 'online' ? '#22c55e' : '#9ca3af',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          border: `1px solid ${player.status === 'online' ? '#22c55e' : '#9ca3af'}`,
          fontWeight: '500'
        }}>
          {player.status}
        </span>
      </div>
      
      <p style={{ color: '#d1d5db', marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>
        {player.games.join(', ')}
      </p>
      
      <p style={{ color: '#d1d5db', fontSize: '0.875rem', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
        {player.platform} • {player.playstyle}
      </p>
      
      {showRating && (
        <p style={{ color: '#d1d5db', fontSize: '0.875rem', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
          Rating: {player.rating}/5.0
        </p>
      )}
      
      <button 
        onClick={handleConnect}
        disabled={isConnecting}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '0.5rem',
          cursor: isConnecting ? 'not-allowed' : 'pointer',
          fontWeight: '500',
          transition: 'all 0.2s ease',
          opacity: isConnecting ? 0.7 : 1
        }}
        onMouseEnter={(e) => {
          if (!isConnecting) {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isConnecting) {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          }
        }}
      >
        {isConnecting ? 'Sending...' : 'Connect'}
      </button>
            {statusMessage && (
        <p
          style={{
            marginTop: '0.75rem',
            fontSize: '0.875rem',
            color: requestSent ? '#22c55e' : '#f87171'
          }}
        >
          {statusMessage}
        </p>
      )}
    </div>
  );
};

export default PlayerCard;
