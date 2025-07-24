"use client";

import React from 'react';
import { MessageCircle } from 'lucide-react';

// Mock user data
const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@hawaii.edu',
  games: ['Valorant', 'Overwatch 2', 'Apex Legends'],
  platforms: ['PC'],
  playstyle: 'Competitive',
  location: 'UH Mānoa Campus',
  bio: 'Looking for teammates to climb ranked! Available most evenings.',
  discord: 'JohnDoe#1234',
  notifications: true,
  avatar: '🎮'
};

const Profile: React.FC = () => (
  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
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
            fontSize: '2.25rem'
          }}>
            {mockUser.avatar}
          </div>
          <div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>{mockUser.name}</h2>
            <p style={{ color: '#e5e7eb' }}>{mockUser.email}</p>
            <p style={{ color: '#e5e7eb' }}>{mockUser.location}</p>
          </div>
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
                    {mockUser.games.map(game => (
                      <span key={game} style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem'
                      }}>
                        {game}
                      </span>
                    ))}
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
                    {mockUser.platforms.map(platform => (
                      <span key={platform} style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem'
                      }}>
                        {platform}
                      </span>
                    ))}
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
                    Playstyle
                  </label>
                  <span style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem'
                  }}>
                    {mockUser.playstyle}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem' }}>Bio</h3>
              <p style={{ color: '#d1d5db' }}>{mockUser.bio}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem' }}>Contact Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageCircle style={{ height: '1rem', width: '1rem', color: '#d1d5db' }} />
                  <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>Discord: {mockUser.discord}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem' }}>Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>Notifications</span>
                  <button style={{ 
                    width: '3rem',
                    height: '1.5rem',
                    borderRadius: '9999px',
                    backgroundColor: mockUser.notifications ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{ 
                      width: '1.25rem',
                      height: '1.25rem',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '0.125rem',
                      left: mockUser.notifications ? '1.5rem' : '0.25rem',
                      transition: 'all 0.2s ease'
                    }}></div>
                  </button>
                </div>
              </div>
            </div>

            <button style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Profile;
