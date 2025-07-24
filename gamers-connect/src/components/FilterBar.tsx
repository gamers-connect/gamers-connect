"use client";

import React from 'react';
import { Search } from 'lucide-react';

interface FilterBarProps {
  games: string[];
  platforms: string[];
  playstyles: string[];
  searchGame: string;
  searchPlatform: string;
  searchPlaystyle: string;
  onGameChange: (value: string) => void;
  onPlatformChange: (value: string) => void;
  onPlaystyleChange: (value: string) => void;
  onSearch: () => void;
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
  onSearch
}) => (
  <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
    <div className="grid md:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Game</label>
        <select 
          value={searchGame}
          onChange={(e) => onGameChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
        >
          <option value="">All Games</option>
          {games.map(game => (
            <option key={game} value={game}>{game}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
        <select 
          value={searchPlatform}
          onChange={(e) => onPlatformChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
        >
          <option value="">All Platforms</option>
          {platforms.map(platform => (
            <option key={platform} value={platform}>{platform}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Playstyle</label>
        <select 
          value={searchPlaystyle}
          onChange={(e) => onPlaystyleChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
        >
          <option value="">All Playstyles</option>
          {playstyles.map(style => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>
      </div>
      <div className="flex items-end">
        <button 
          onClick={onSearch}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
        </button>
      </div>
    </div>
  </div>
);

export default FilterBar;
