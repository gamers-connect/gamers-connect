"use client";

import React, { useState } from 'react';
import PlayerCard from '../../components/PlayerCard';
import FilterBar from '../../components/FilterBar';

// Mock data
const mockGames = [
  'Valorant', 'Overwatch 2', 'Super Smash Bros', 'League of Legends', 
  'Apex Legends', 'Rocket League', 'Minecraft', 'Among Us'
];

const mockPlatforms = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];
const mockPlaystyles = ['Casual', 'Competitive', 'Cooperative'];

const mockPlayers = [
  { id: 1, name: 'Alex Chen', games: ['Valorant', 'Overwatch 2'], platform: 'PC', playstyle: 'Competitive', location: 'UH Mānoa Campus', status: 'online' as const, rating: 4.8 },
  { id: 2, name: 'Sarah Kim', games: ['Super Smash Bros', 'Minecraft'], platform: 'Nintendo Switch', playstyle: 'Casual', location: 'UH Mānoa Campus', status: 'online' as const, rating: 4.9 },
  { id: 3, name: 'Marcus Johnson', games: ['Apex Legends', 'Rocket League'], platform: 'PC', playstyle: 'Competitive', location: 'UH West Oahu', status: 'away' as const, rating: 4.7 },
  { id: 4, name: 'Luna Patel', games: ['League of Legends', 'Valorant'], platform: 'PC', playstyle: 'Competitive', location: 'UH Mānoa Campus', status: 'online' as const, rating: 4.6 }
];

const FindPlayers: React.FC = () => {
  const [searchGame, setSearchGame] = useState('');
  const [searchPlatform, setSearchPlatform] = useState('');
  const [searchPlaystyle, setSearchPlaystyle] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', { searchGame, searchPlatform, searchPlaystyle });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
          Find Players
        </h2>
        <p style={{ color: '#d1d5db' }}>Connect with fellow UH gamers who share your interests</p>
      </div>

      <FilterBar
        games={mockGames}
        platforms={mockPlatforms}
        playstyles={mockPlaystyles}
        searchGame={searchGame}
        searchPlatform={searchPlatform}
        searchPlaystyle={searchPlaystyle}
        onGameChange={setSearchGame}
        onPlatformChange={setSearchPlatform}
        onPlaystyleChange={setSearchPlaystyle}
        onSearch={handleSearch}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {mockPlayers.map(player => (
          <PlayerCard key={player.id} player={player} showRating isDetailed />
        ))}
      </div>
    </div>
  );
};

export default FindPlayers;
