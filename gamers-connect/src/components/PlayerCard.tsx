"use client";

import React from 'react';
import { Player } from '../app/types';

interface PlayerCardProps {
  player: Player;
  showRating?: boolean;
  isDetailed?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  showRating = false, 
}) => (
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
    
    <button style={{
      width: '100%',
      padding: '0.75rem',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.2s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    }}>
      Connect
    </button>
  </div>
);

export default PlayerCard;
