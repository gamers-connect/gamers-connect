/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import PlayerCard from '../../components/PlayerCard';
import FilterBar from '../../components/FilterBar';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

const mockGames = [
  'Valorant', 'Overwatch 2', 'Super Smash Bros', 'League of Legends', 
  'Apex Legends', 'Rocket League', 'Minecraft', 'Among Us'
];

const mockPlatforms = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];
const mockPlaystyles = ['Casual', 'Competitive', 'Cooperative'];

const FindPlayers: React.FC = () => {
  const { user } = useAuth();
  const [players, setPlayers] = useState([]);
  const [searchGame, setSearchGame] = useState('');
  const [searchPlatform, setSearchPlatform] = useState('');
  const [searchPlaystyle, setSearchPlaystyle] = useState('');

  const fetchPlayers = async () => {
    try {
      const params = new URLSearchParams();
      if (searchGame) params.append('game', searchGame);
      if (searchPlatform) params.append('platform', searchPlatform);
      if (searchPlaystyle) params.append('playstyle', searchPlaystyle);

      const res = await fetch(`/api/users?${params.toString()}`);
      const data = await res.json();

      if (user) {
        setPlayers(data.users.filter((p: any) => p.id !== user.id));
      } else {
        setPlayers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch players:', error);
    }
  };

  useEffect(() => {
    fetchPlayers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    fetchPlayers();
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
        {players.map((player: any) => (
          <PlayerCard key={player.id} player={player} showRating isDetailed />
        ))}
      </div>
    </div>
  );
};

export default FindPlayers;
