"use client";

import React from 'react';
import { Star, Gamepad2, Settings, MapPin } from 'lucide-react';

interface Player {
  id: number;
  name: string;
  games: string[];
  platform: string;
  playstyle: string;
  location: string;
  status: 'online' | 'away' | 'offline';
  rating: number;
}

interface PlayerCardProps {
  player: Player;
  showRating?: boolean;
  isDetailed?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  showRating = false, 
  isDetailed = false 
}) => {
  if (isDetailed) {
    return (
      <div className="player-card-detailed">
        <div className="player-card-header">
          <div className="player-info">
            <div className="player-avatar">
              {player.name.charAt(0)}
            </div>
            <div className="player-details">
              <h3 className="player-name">{player.name}</h3>
              {showRating && (
                <div className="player-rating">
                  <Star className="rating-star" />
                  <span className="rating-value">{player.rating}</span>
                </div>
              )}
            </div>
          </div>
          <span className={`status-badge status-${player.status}`}>
            {player.status}
          </span>
        </div>

        <div className="player-meta">
          <div className="meta-item">
            <Gamepad2 className="meta-icon" />
            <span className="meta-text">{player.games.join(', ')}</span>
          </div>
          <div className="meta-item">
            <Settings className="meta-icon" />
            <span className="meta-text">{player.platform} • {player.playstyle}</span>
          </div>
          <div className="meta-item">
            <MapPin className="meta-icon" />
            <span className="meta-text">{player.location}</span>
          </div>
        </div>

        <div className="player-actions">
          <button className="btn btn-primary btn-flex">
            Connect
          </button>
          <button className="btn btn-outline btn-flex">
            View Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="player-card-compact">
      <div className="compact-header">
        <h4 className="compact-name">{player.name}</h4>
        <span className={`status-badge-small status-${player.status}`}>
          {player.status}
        </span>
      </div>
      {showRating && (
        <div className="compact-rating">
          <Star className="rating-star-small" />
          <span className="rating-value-small">{player.rating}</span>
        </div>
      )}
      <p className="compact-games">{player.games.join(', ')}</p>
      <p className="compact-platform">{player.platform} • {player.playstyle}</p>
      <button className="btn btn-primary btn-full">
        Connect
      </button>
    </div>
  );
};

export default PlayerCard;
