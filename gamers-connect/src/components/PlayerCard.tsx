"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '../lib/api';
import PlayerModal from './PlayerModal';

type LowerStatus = 'online' | 'away' | 'offline';

type PlayerLike = {
  id: string | number;
  name: string;
  email?: string;
  avatar?: string | null;
  bio?: string | null;
  discord?: string | null;
  location?: string | null;
  // Either old mock shape...
  platform?: string;
  rating?: number;
  // ...or real API shape:
  platforms?: string[];
  games?: string[];
  playstyle?: string | null;
  // Status can come in upper or lower case, or be missing
  status?: LowerStatus | 'ONLINE' | 'AWAY' | 'OFFLINE';
};

interface PlayerCardProps {
  player: PlayerLike;
  showRating?: boolean;
  isDetailed?: boolean;
  onUpdate?: () => void;
}

const toLowerStatus = (s?: PlayerLike['status']): LowerStatus => {
  if (s === 'ONLINE' || s === 'online') return 'online';
  if (s === 'AWAY' || s === 'away') return 'away';
  return 'offline';
};

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  showRating = false,
  onUpdate
}) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // --- Normalize data for rendering ---
  const status = toLowerStatus(player.status);
  const games = player.games ?? [];
  const platformText = player.platform ?? player.platforms?.[0] ?? 'Unknown';
  const playstyleText = player.playstyle ?? '';
  const rating = typeof player.rating === 'number' ? player.rating : undefined;

  const badgeStyles =
    status === 'online'
      ? {
          bg: 'rgba(34, 197, 94, 0.2)',
          color: '#22c55e',
          border: '#22c55e'
        }
      : status === 'away'
      ? {
          bg: 'rgba(234, 179, 8, 0.2)',
          color: '#eab308',
          border: '#eab308'
        }
      : {
          bg: 'rgba(156, 163, 175, 0.2)',
          color: '#9ca3af',
          border: '#9ca3af'
        };

  const handleConnect = async () => {
    if (!user) return;
    setIsConnecting(true);
    try {
      await api.connections.send(
        user.id,
        String(player.id),
        `Hi ${player.name}! I'd like to connect and play together.`
      );
      
      setRequestSent(true);
      setStatusMessage(`Friend request sent to ${player.name}!`);
      onUpdate?.();
      setTimeout(() => setStatusMessage(null), 5000);
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
      <div
        style={{
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
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>{player.name}</h3>
          <span
            style={{
              backgroundColor: badgeStyles.bg,
              color: badgeStyles.color,
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              border: `1px solid ${badgeStyles.border}`,
              fontWeight: '500',
              textTransform: 'capitalize'
            }}
          >
            {status}
          </span>
        </div>

        <p style={{ color: '#d1d5db', margin: '0 0 0.75rem 0' }}>
          {games.length ? games.join(', ') : 'No games listed'}
        </p>

        <p style={{ color: '#d1d5db', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
          {platformText}{playstyleText ? ` • ${playstyleText}` : ''}
        </p>

        {showRating && typeof rating === 'number' && (
          <p style={{ color: '#d1d5db', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
            Rating: {rating.toFixed(1)}/5.0
          </p>
        )}

        <button
          onClick={() => setIsModalOpen(true)}
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
          {requestSent ? 'Request Sent' : 'View Profile'}
        </button>

        {statusMessage && (
          <p
            style={{
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
