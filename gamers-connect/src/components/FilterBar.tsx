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
  <div className="filter-bar">
    <div className="filter-grid">
      <div className="filter-group">
        <label className="filter-label">Game</label>
        <select 
          value={searchGame}
          onChange={(e) => onGameChange(e.target.value)}
          className="filter-select"
        >
          <option value="">All Games</option>
          {games.map(game => (
            <option key={game} value={game}>{game}</option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label className="filter-label">Platform</label>
        <select 
          value={searchPlatform}
          onChange={(e) => onPlatformChange(e.target.value)}
          className="filter-select"
        >
          <option value="">All Platforms</option>
          {platforms.map(platform => (
            <option key={platform} value={platform}>{platform}</option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label className="filter-label">Playstyle</label>
        <select 
          value={searchPlaystyle}
          onChange={(e) => onPlaystyleChange(e.target.value)}
          className="filter-select"
        >
          <option value="">All Playstyles</option>
          {playstyles.map(style => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>
      </div>
      <div className="filter-button-container">
        <button 
          onClick={onSearch}
          className="filter-search-btn"
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
        </button>
      </div>
    </div>
  </div>
);

export default FilterBar;
