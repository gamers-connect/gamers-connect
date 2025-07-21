"use client";

import React from 'react';
import { Gamepad2, Bell } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  games: string[];
  platforms: string[];
  playstyle: string;
  location: string;
  bio: string;
  discord: string;
  notifications: boolean;
  avatar: string;
}

interface NavigationProps {
  user: User | null;
  currentPage: string;
  onPageChange: (page: string) => void;
  onToggleNotifications: () => void;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  user, 
  currentPage, 
  onPageChange, 
  onToggleNotifications, 
  onLogout 
}) => {
  if (!user) return null;

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Gamepad2 className="h-8 w-8 text-black" />
              <h1 className="text-2xl font-bold text-black">Game Connect</h1>
            </div>
            
            <div className="hidden md:flex space-x-6">
              <button 
                onClick={() => onPageChange('dashboard')}
                className={`px-4 py-2 rounded-lg transition-all hover:bg-gray-100 ${
                  currentPage === 'dashboard' ? 'bg-gray-200 text-black' : ''
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => onPageChange('players')}
                className={`px-4 py-2 rounded-lg transition-all hover:bg-gray-100 ${
                  currentPage === 'players' ? 'bg-gray-200 text-black' : ''
                }`}
              >
                Find Players
              </button>
              <button 
                onClick={() => onPageChange('events')}
                className={`px-4 py-2 rounded-lg transition-all hover:bg-gray-100 ${
                  currentPage === 'events' ? 'bg-gray-200 text-black' : ''
                }`}
              >
                Events
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={onToggleNotifications}
              className="p-2 hover:bg-gray-100 rounded-lg relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
            
            <button 
              onClick={() => onPageChange('profile')}
              className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-3 py-2"
            >
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
                {user?.avatar}
              </div>
              <span className="hidden md:block">{user?.name}</span>
            </button>
            
            <button 
              onClick={onLogout}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
