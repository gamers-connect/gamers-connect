/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Add this import
import api from '../lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar?: string;
  games: string[];
  platforms: string[];
  playstyle?: string;
  location?: string;
  bio?: string;
  discord?: string;
  status: 'ONLINE' | 'AWAY' | 'OFFLINE';
  createdAt?: string;
  notifications?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>; // This needs to be fixed
  updateProfile: (userData: Partial<User>) => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  username: string;
  avatar?: string;
  games?: string[];
  platforms?: string[];
  playstyle?: string;
  location?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to normalize user profile data
const normalizeUserProfile = (profile: any): User => {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    username: profile.username || '',
    avatar: profile.avatar,
    games: profile.games || [],
    platforms: profile.platforms || [],
    playstyle: profile.playstyle,
    location: profile.location,
    bio: profile.bio,
    discord: profile.discord,
    status: (profile.status === 'ONLINE' || profile.status === 'AWAY' || profile.status === 'OFFLINE') 
      ? profile.status 
      : 'OFFLINE',
    createdAt: profile.createdAt || new Date().toISOString(),
    notifications: profile.notifications ?? true,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Add this

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          api.setToken(token);
          const profile = await api.auth.getProfile();
          const normalizedUser = normalizeUserProfile(profile);
          setUser(normalizedUser);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth_token');
        api.clearToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login({ email, password });
      localStorage.setItem('auth_token', response.token); // Make sure token is stored
      api.setToken(response.token);
      const normalizedUser = normalizeUserProfile(response.user);
      setUser(normalizedUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await api.auth.register(userData);
      localStorage.setItem('auth_token', response.token); // Make sure token is stored
      api.setToken(response.token);
      const normalizedUser = normalizeUserProfile(response.user);
      setUser(normalizedUser);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call your backend logout endpoint
      const token = localStorage.getItem('auth_token');
      if (token) {
        await fetch('/api/auth/signout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }).catch(() => {
          // Ignore errors in logout API call
        });
      }
      
      // Call api.auth.logout() if it does actual backend work
      await api.auth.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local auth state
      localStorage.removeItem('auth_token');
      api.clearToken();
      setUser(null);
      
      // Redirect to home page
      router.push('/');
      router.refresh(); // Refresh to update auth state
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = await api.users.update(user.id, userData);
      const normalizedUser = normalizeUserProfile(updatedUser);
      setUser(normalizedUser);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
