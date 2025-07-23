"use client";

import React from 'react';
import { Plus, Search } from 'lucide-react';

interface QuickActionsProps {
  onFindPlayers: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onFindPlayers }) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
    <div className="space-y-3">
      <button className="w-full bg-black text-white flex items-center justify-center space-x-2 py-3 rounded-lg hover:bg-gray-800 transition-colors">
        <Plus className="h-4 w-4" />
        <span>Create Session</span>
      </button>
      <button 
        onClick={onFindPlayers}
        className="w-full border border-black text-black flex items-center justify-center space-x-2 py-3 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Search className="h-4 w-4" />
        <span>Find Players</span>
      </button>
    </div>
  </div>
);
