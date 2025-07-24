"use client";

import React from 'react';
import { Users, Plus } from 'lucide-react';

interface QuickActionsProps {
  onFindPlayers: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onFindPlayers }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    color: 'white'
  }}>
    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Quick Actions</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <button
        onClick={onFindPlayers}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          width: '100%',
          padding: '0.75rem',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontWeight: '500'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        <Users style={{ height: '1.25rem', width: '1.25rem' }} />
        <span>Find Players</span>
      </button>
      <button style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        width: '100%',
        padding: '0.75rem',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontWeight: '500'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      }}>
        <Plus style={{ height: '1.25rem', width: '1.25rem' }} />
        <span>Create Session</span>
      </button>
    </div>
  </div>
);

export default QuickActions;
