"use client";

import React, { useState } from 'react';
import { X, Lock, Globe } from 'lucide-react';

interface SessionCreationModelProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSession: (session: unknown) => void;
}

const SessionCreationModel: React.FC<SessionCreationModelProps> = ({ 
  isOpen, 
  onClose, 
  onCreateSession 
}) => {
  const [sessionData, setSessionData] = useState({
    title: '',
    game: '',
    description: '',
    date: '',
    time: '',
    maxPlayers: 4,
    isPrivate: false,
    platform: '',
    skillLevel: 'Any'
  });

  const games = ['Valorant', 'Overwatch 2', 'League of Legends', 'Apex Legends', 'Minecraft'];
  const platforms = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Any'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateSession({
      ...sessionData,
      id: Date.now(),
      host: 'Current User',
      players: 1
    });
    setSessionData({
      title: '',
      game: '',
      description: '',
      date: '',
      time: '',
      maxPlayers: 4,
      isPrivate: false,
      platform: '',
      skillLevel: 'Any'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Create Gaming Session</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Title *
              </label>
              <input
                type="text"
                required
                value={sessionData.title}
                onChange={(e) => setSessionData({ ...sessionData, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., Ranked Valorant Grind"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Game *
                </label>
                <select
                  required
                  value={sessionData.game}
                  onChange={(e) => setSessionData({ ...sessionData, game: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Select a game</option>
                  {games.map(game => (
                    <option key={game} value={game}>{game}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform *
                </label>
                <select
                  required
                  value={sessionData.platform}
                  onChange={(e) => setSessionData({ ...sessionData, platform: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Select platform</option>
                  {platforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={sessionData.date}
                  onChange={(e) => setSessionData({ ...sessionData, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  required
                  value={sessionData.time}
                  onChange={(e) => setSessionData({ ...sessionData, time: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Players
                </label>
                <input
                  type="number"
                  min="2"
                  max="20"
                  value={sessionData.maxPlayers}
                  onChange={(e) => setSessionData({ ...sessionData, maxPlayers: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Level
              </label>
              <select
                value={sessionData.skillLevel}
                onChange={(e) => setSessionData({ ...sessionData, skillLevel: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              >
                {skillLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                value={sessionData.description}
                onChange={(e) => setSessionData({ ...sessionData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Tell other players what to expect..."
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="private"
                  checked={sessionData.isPrivate}
                  onChange={(e) => setSessionData({ ...sessionData, isPrivate: e.target.checked })}
                  className="w-4 h-4 text-black"
                />
                <label htmlFor="private" className="text-sm text-gray-700 flex items-center space-x-1">
                  {sessionData.isPrivate ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                  <span>{sessionData.isPrivate ? 'Private Session' : 'Public Session'}</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Create Session
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SessionCreationModel;
