"use client";

import React from 'react';
import { Player } from '@/lib/types';

interface PlayerModalProps {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
  isConnecting: boolean;
}

const PlayerModal: React.FC<PlayerModalProps> = ({ player, isOpen, onClose, onConnect, isConnecting }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
    }}>
      <div style={{
        background: '#1f2937',
        borderRadius: '1rem',
        padding: '2rem',
        width: '90%',
        maxWidth: '500px',
        color: 'white',
        position: 'relative',
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: '#9ca3af',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{player.name}</h2>
        <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>{player.status}</p>

        <p><strong>Bio:</strong> {player.bio || 'N/A'}</p>        
        <p><strong>Discord:</strong> {player.discord || 'N/A'}</p>
        <p><strong>Location:</strong> {player.location}</p>
        <p><strong>Games:</strong> {player.games?.join(', ')}</p>
        <p><strong>Platform:</strong> {player.platform}</p>
        <p><strong>Playstyle:</strong> {player.playstyle}</p>

        <button 
          onClick={onConnect}
          disabled={isConnecting}
          style={{
            marginTop: '1.5rem',
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#3b82f6',
            border: 'none',
            borderRadius: '0.5rem',
            color: 'white',
            fontWeight: '600',
            cursor: isConnecting ? 'not-allowed' : 'pointer',
            opacity: isConnecting ? 0.6 : 1
          }}
        >
          {isConnecting ? 'Sending...' : 'Send Connection Request'}
        </button>
      </div>
    </div>
  );
};

export default PlayerModal;

