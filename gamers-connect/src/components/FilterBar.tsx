"use client";

import React from 'react';
import { Search } from 'lucide-react';
import api from '@/lib/api';

interface FilterBarProps {
  games: string[];
  platforms: string[];
  playstyles: string[];
  searchGame: string;
  searchPlatform: string;
  searchPlaystyle: string;
  onGameChange: (game: string) => void;
  onPlatformChange: (platform: string) => void;
  onPlaystyleChange: (playstyle: string) => void;
  onSearch: (filters: { game: string; platform: string; playstyle: string }) => void; // Updated prop
}

const FilterBar: React.FC<FilterBarProps> = ({
  games,
  platforms,
  playstyles,
  searchGame,
  searchPlatform,
  searchPlaystyle,
  onGameChange,
  onPlatformChange,
  onPlaystyleChange,
  onSearch // Use the updated prop
}) => {
  // Handler for the search button
  const handleSearch = () => {
    onSearch({
      game: searchGame,
      platform: searchPlatform,
      playstyle: searchPlaystyle
    });
  };

  // Handler for pressing Enter in any select field
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      marginBottom: '2rem',
      color: 'white'
    }}>
      <h3 style={{ 
        fontSize: '1.125rem', 
        fontWeight: '600', 
        marginBottom: '1rem',
        margin: '0 0 1rem 0',
        color: 'white'
      }}>
        Filter Players
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#d1d5db',
            marginBottom: '0.5rem'
          }}>
            Game
          </label>
          <select 
            value={searchGame}
            onChange={(e) => onGameChange(e.target.value)}
            onKeyDown={handleKeyDown} // Add Enter key support
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '0.5rem',
              color: 'white',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            <option value="" style={{ backgroundColor: '#374151', color: 'white' }}>All Games</option>
            {games.map(game => (
              <option key={game} value={game} style={{ backgroundColor: '#374151', color: 'white' }}>
                {game}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#d1d5db',
            marginBottom: '0.5rem'
          }}>
            Platform
          </label>
          <select 
            value={searchPlatform}
            onChange={(e) => onPlatformChange(e.target.value)}
            onKeyDown={handleKeyDown} // Add Enter key support
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '0.5rem',
              color: 'white',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            <option value="" style={{ backgroundColor: '#374151', color: 'white' }}>All Platforms</option>
            {platforms.map(platform => (
              <option key={platform} value={platform} style={{ backgroundColor: '#374151', color: 'white' }}>
                {platform}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#d1d5db',
            marginBottom: '0.5rem'
          }}>
            Playstyle
          </label>
          <select 
            value={searchPlaystyle}
            onChange={(e) => onPlaystyleChange(e.target.value)}
            onKeyDown={handleKeyDown} // Add Enter key support
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '0.5rem',
              color: 'white',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            <option value="" style={{ backgroundColor: '#374151', color: 'white' }}>All Playstyles</option>
            {playstyles.map(playstyle => (
              <option key={playstyle} value={playstyle} style={{ backgroundColor: '#374151', color: 'white' }}>
                {playstyle}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <button 
        onClick={handleSearch} // Use the new handler
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontWeight: '500',
          fontSize: '0.875rem',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <Search style={{ height: '1rem', width: '1rem' }} />
        <span>Search Players</span>
      </button>
    </div>
  );
};

export default FilterBar;
