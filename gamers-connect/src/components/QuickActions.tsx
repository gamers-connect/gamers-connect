"use client";

import React from 'react';
import { Plus, Search } from 'lucide-react';

interface QuickActionsProps {
  onFindPlayers: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onFindPlayers }) => (
  <div className="quick-actions-card">
    <h3 className="quick-actions-title">Quick Actions</h3>
    <div className="quick-actions-list">
      <button className="quick-action-btn quick-action-primary">
        <Plus className="h-4 w-4" />
        <span>Create Session</span>
      </button>
      <button 
        onClick={onFindPlayers}
        className="quick-action-btn quick-action-secondary"
      >
        <Search className="h-4 w-4" />
        <span>Find Players</span>
      </button>
    </div>
  </div>
);

export default QuickActions;
