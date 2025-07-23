"use client";

import React, { useState } from 'react';
import { Plus, Gamepad2 } from 'lucide-react';

interface AvailabilityPost {
  id: number;
  game: string;
  message: string;
  duration: string;
  timestamp: string;
  user: string;
}

interface AvailabilityPosterProps {
  onPostAvailability: (post: AvailabilityPost) => void;
}

const AvailabilityPoster: React.FC<AvailabilityPosterProps> = ({ onPostAvailability }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [postData, setPostData] = useState({
    game: '',
    message: '',
    duration: '1-2 hours'
  });

  const games = ['Valorant', 'Overwatch 2', 'League of Legends', 'Apex Legends', 'Minecraft', 'Any Game'];
  const durations = ['30 minutes', '1-2 hours', '2-4 hours', 'All day', 'Open-ended'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: AvailabilityPost = {
      id: Date.now(),
      ...postData,
      timestamp: new Date().toISOString(),
      user: 'Current User'
    };
    onPostAvailability(newPost);
    setPostData({ game: '', message: '', duration: '1-2 hours' });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 hover:bg-gray-100 transition-colors text-center"
      >
        <Plus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-gray-600 font-medium">Post Your Availability</p>
        <p className="text-sm text-gray-500">Let others know you are looking to play</p>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-black">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Gamepad2 className="h-5 w-5 mr-2" />
        Post Your Gaming Availability
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What game are you looking to play?
          </label>
          <select
            required
            value={postData.game}
            onChange={(e) => setPostData({ ...postData, game: e.target.value })}
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
            How long are you available?
          </label>
          <select
            value={postData.duration}
            onChange={(e) => setPostData({ ...postData, duration: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          >
            {durations.map(duration => (
              <option key={duration} value={duration}>{duration}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message (optional)
          </label>
          <textarea
            rows={3}
            value={postData.message}
            onChange={(e) => setPostData({ ...postData, message: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="e.g., Looking for ranked teammates, casual play, or just want to have fun!"
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Post Availability
          </button>
        </div>
      </form>
    </div>
  );
};

export default AvailabilityPoster;
