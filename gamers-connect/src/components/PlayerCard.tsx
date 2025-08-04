"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Player } from '@/lib/types';
import api from '../lib/api';
import PlayerModal from './PlayerModal';

interface PlayerCardProps {
  player: Player;
  showRating?: boolean;
  isDetailed?: boolean;
  onUpdate?: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  showRating = false,
  onUpdate 
}) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleConnect = async () => {
    if (!user) return;
    setIsConnecting(true);
    try {
      await api.connections.send(user.id, String(player.id), `Hi ${player.name}! I'd like to connect and play together.`);
      setStatusMessage(`Friend request sent to ${player.name}!`);
      if (onUpdate) onUpdate();
      setTimeout(() => setStatusMessage(null), 5000);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Connection request failed:', error);
      setStatusMessage('Failed to send friend request.');
      setTimeout(() => setStatusMessage(null), 5000);
    } finally {
      setIsConnecting(false);
    }
  };

  const isOwnProfile = user?.id === String(player.id);

  return (
    <>
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
        
        <p style={{ color: '#d1d5db', marginBottom: '0.75rem' }}>
          {player.games.join(', ')}
        </p>
        
        <p><strong>Platform:</strong> {player.platform}</p>

        {showRating && (
          <p style={{ color: '#d1d5db', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Rating: {player.rating}/5.0
          </p>
        )}
        
        {!isOwnProfile && (
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '0.5rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            Connect
          </button>
        )}
        {statusMessage && (
          <p style={{
            marginTop: '0.75rem',
            fontSize: '0.875rem',
            color: statusMessage.includes('Failed') ? '#f87171' : '#22c55e'
          }}>
            {statusMessage}
          </p>
        )}
      </div>

      <PlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        player={player}
        onConnect={handleConnect}
        isConnecting={isConnecting}
      />
    </>
  );
};

export default PlayerCard;
