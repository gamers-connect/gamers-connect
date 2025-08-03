/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { MessageCircle, Edit3, Settings, Bell, BellOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Game emoji mapping
const getGameEmoji = (game: string): string => {
  const gameEmojis: { [key: string]: string } = {
    'Valorant': '🔫',
    'Overwatch 2': '🦾',
    'League of Legends': '⚔️',
    'Apex Legends': '🎯',
    'Minecraft': '⛏️',
    'Rocket League': '🚗',
    'Super Smash Bros': '👊',
    'Among Us': '🚀',
    'Call of Duty': '💥',
    'Fortnite': '🏗️',
    'CS2': '💣',
    'Dota 2': '🗡️'
  };
  return gameEmojis[game] || '🎮';
};

// Get primary game emoji for profile picture
const getProfileEmoji = (games: string[]): string => {
  if (!games || games.length === 0) return '🎮';
  return getGameEmoji(games[0]);
};

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSave: (updatedData: any) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    discord: user?.discord || '',
    location: user?.location || '',
    games: user?.games || [],
    platforms: user?.platforms || [],
    playstyle: user?.playstyle || 'Casual'
  });
  const [loading, setLoading] = useState(false);

  const availableGames = ['Valorant', 'Overwatch 2', 'League of Legends', 'Apex Legends', 'Minecraft', 'Rocket League', 'Super Smash Bros', 'Among Us', 'Call of Duty', 'Fortnite', 'CS2', 'Dota 2'];
  const availablePlatforms = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];
  const playstyles = ['Casual', 'Competitive', 'Cooperative', 'Social'];

  const handleGameToggle = (game: string) => {
    setFormData(prev => ({
      ...prev,
      games: prev.games.includes(game) 
        ? prev.games.filter((g: string) => g !== game)
        : [...prev.games, game]
    }));
  };

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p: string) => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>Edit Profile</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Basic Info */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter your display name"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Tell others about your gaming style and preferences..."
                />
              </div>

              {/* Contact Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Discord Username
                  </label>
                  <input
                    type="text"
                    value={formData.discord}
                    onChange={(e) => setFormData(prev => ({ ...prev, discord: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="YourName#1234"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="UH Campus or City"
                  />
                </div>
              </div>

              {/* Gaming Preferences */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Favorite Games
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
                  {availableGames.map(game => (
                    <button
                      key={game}
                      type="button"
                      onClick={() => handleGameToggle(game)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        backgroundColor: formData.games.includes(game) ? '#3b82f6' : 'white',
                        color: formData.games.includes(game) ? 'white' : '#374151',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {getGameEmoji(game)} {game}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Platforms
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {availablePlatforms.map(platform => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => handlePlatformToggle(platform)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        backgroundColor: formData.platforms.includes(platform) ? '#10b981' : 'white',
                        color: formData.platforms.includes(platform) ? 'white' : '#374151',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Playstyle
                </label>
                <select
                  value={formData.playstyle}
                  onChange={(e) => setFormData(prev => ({ ...prev, playstyle: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                >
                  {playstyles.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // If user is not loaded, show loading or prompt to complete profile
  if (!user) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <div style={{ color: 'white', fontSize: '1.125rem' }}>
          Please sign in to view your profile.
        </div>
      </div>
    );
  }

  const handleProfileUpdate = async (updatedData: any) => {
    try {
      await updateProfile(updatedData);
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
    // Here you would also update the user's notification preference in the backend
  };

  // Check if profile is incomplete
  const isProfileIncomplete = !user.bio || !user.discord || !user.games?.length || !user.platforms?.length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {isProfileIncomplete && (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1.5rem',
          color: '#92400e'
        }}>
          <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Complete Your Profile</div>
          <div style={{ fontSize: '0.875rem' }}>
            Add your gaming preferences, bio, and contact info to connect with other players!
          </div>
        </div>
      )}

      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        color: 'white'
      }}>
        <div style={{ 
          background: 'linear-gradient(to right, #374151, #000000)',
          padding: '2rem 1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ 
              width: '6rem',
              height: '6rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.25rem',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>
              {getProfileEmoji(user.games || [])}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0 }}>{user.name}</h2>
              <p style={{ color: '#e5e7eb', margin: '0.25rem 0' }}>{user.email}</p>
              {user.location && (
                <p style={{ color: '#e5e7eb', margin: '0.25rem 0' }}>{user.location}</p>
              )}
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              <Edit3 size={16} />
              Edit Profile
            </button>
          </div>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                  Gaming Preferences
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '500',
                      color: '#d1d5db',
                      marginBottom: '0.5rem'
                    }}>
                      Favorite Games
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {user.games && user.games.length > 0 ? (
                        user.games.map((game: string) => (
                          <span key={game} style={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            {getGameEmoji(game)} {game}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No games selected</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '500',
                      color: '#d1d5db',
                      marginBottom: '0.5rem'
                    }}>
                      Platforms
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {user.platforms && user.platforms.length > 0 ? (
                        user.platforms.map((platform: string) => (
                          <span key={platform} style={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem'
                          }}>
                            {platform}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No platforms selected</span>
                      )}
                    </div>
                  </div>
                  {user.playstyle && (
                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '0.875rem', 
                        fontWeight: '500',
                        color: '#d1d5db',
                        marginBottom: '0.5rem'
                      }}>
                        Playstyle
                      </label>
                      <span style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem'
                      }}>
                        {user.playstyle}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem' }}>Bio</h3>
                <p style={{ color: '#d1d5db' }}>
                  {user.bio || 'No bio added yet. Click "Edit Profile" to add information about yourself!'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem' }}>Contact Info</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {user.discord ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MessageCircle style={{ height: '1rem', width: '1rem', color: '#d1d5db' }} />
                      <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>Discord: {user.discord}</span>
                    </div>
                  ) : (
                    <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No Discord username set</span>
                  )}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem' }}>Settings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {notifications ? <Bell size={16} color="#d1d5db" /> : <BellOff size={16} color="#d1d5db" />}
                      <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>Notifications</span>
                    </div>
                    <button 
                      onClick={toggleNotifications}
                      style={{ 
                        width: '3rem',
                        height: '1.5rem',
                        borderRadius: '9999px',
                        backgroundColor: notifications ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                        border: `1px solid ${notifications ? '#22c55e' : 'rgba(255, 255, 255, 0.2)'}`,
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ 
                        width: '1.25rem',
                        height: '1.25rem',
                        backgroundColor: notifications ? '#22c55e' : 'white',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '0.125rem',
                        left: notifications ? '1.5rem' : '0.25rem',
                        transition: 'all 0.2s ease'
                      }}></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleProfileUpdate}
      />
    </div>
  );
};

export default Profile;
