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
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">
              {player.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold">{player.name}</h3>
              {showRating && (
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-gray-400 fill-current" />
                  <span className="text-sm text-gray-600">{player.rating}</span>
                </div>
              )}
            </div>
          </div>
          <span className={`px-3 py-1 text-sm rounded-full ${
            player.status === 'online' ? 'bg-gray-100 text-gray-800' : 'bg-gray-300 text-gray-700'
          }`}>
            {player.status}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2">
            <Gamepad2 className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{player.games.join(', ')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{player.platform} • {player.playstyle}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{player.location}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Connect
          </button>
          <button className="flex-1 border border-black text-black py-2 rounded-lg hover:bg-gray-50 transition-colors">
            View Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">{player.name}</h4>
        <span className={`px-2 py-1 text-xs rounded-full ${
          player.status === 'online' ? 'bg-gray-100 text-gray-800' : 'bg-gray-300 text-gray-700'
        }`}>
          {player.status}
        </span>
      </div>
      {showRating && (
        <div className="flex items-center space-x-1 mb-2">
          <Star className="h-4 w-4 text-gray-400 fill-current" />
          <span className="text-sm text-gray-600">{player.rating}</span>
        </div>
      )}
      <p className="text-sm text-gray-600 mb-2">{player.games.join(', ')}</p>
      <p className="text-xs text-gray-500 mb-3">{player.platform} • {player.playstyle}</p>
      <button className="bg-black text-white w-full py-2 rounded-lg hover:bg-gray-800 transition-colors">
        Connect
      </button>
    </div>
  );
};

export default PlayerCard;
