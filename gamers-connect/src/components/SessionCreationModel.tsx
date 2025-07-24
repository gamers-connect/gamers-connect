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
    <div className="session-modal-overlay">
      <div className="session-modal-container">
        <div className="session-modal-content">
          <div className="session-modal-header">
            <h2 className="session-modal-title">Create Gaming Session</h2>
            <button 
              onClick={onClose}
              className="modal-close-btn"
            >
              <X className="close-icon" />
            </button>
          </div>

          <div className="session-form">
            <div className="form-field">
              <label className="form-label">
                Session Title *
              </label>
              <input
                type="text"
                required
                value={sessionData.title}
                onChange={(e) => setSessionData({ ...sessionData, title: e.target.value })}
                className="form-input"
                placeholder="e.g., Ranked Valorant Grind"
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">
                  Game *
                </label>
                <select
                  required
                  value={sessionData.game}
                  onChange={(e) => setSessionData({ ...sessionData, game: e.target.value })}
                  className="form-select"
                >
                  <option value="">Select a game</option>
                  {games.map(game => (
                    <option key={game} value={game}>{game}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">
                  Platform *
                </label>
                <select
                  required
                  value={sessionData.platform}
                  onChange={(e) => setSessionData({ ...sessionData, platform: e.target.value })}
                  className="form-select"
                >
                  <option value="">Select platform</option>
                  {platforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row-three">
              <div className="form-field">
                <label className="form-label">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={sessionData.date}
                  onChange={(e) => setSessionData({ ...sessionData, date: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Time *
                </label>
                <input
                  type="time"
                  required
                  value={sessionData.time}
                  onChange={(e) => setSessionData({ ...sessionData, time: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Max Players
                </label>
                <input
                  type="number"
                  min="2"
                  max="20"
                  value={sessionData.maxPlayers}
                  onChange={(e) => setSessionData({ ...sessionData, maxPlayers: parseInt(e.target.value) })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">
                Skill Level
              </label>
              <select
                value={sessionData.skillLevel}
                onChange={(e) => setSessionData({ ...sessionData, skillLevel: e.target.value })}
                className="form-select"
              >
                {skillLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">
                Description
              </label>
              <textarea
                rows={3}
                value={sessionData.description}
                onChange={(e) => setSessionData({ ...sessionData, description: e.target.value })}
                className="form-textarea"
                placeholder="Tell other players what to expect..."
              />
            </div>

            <div className="privacy-setting">
              <div className="privacy-checkbox">
                <input
                  type="checkbox"
                  id="private"
                  checked={sessionData.isPrivate}
                  onChange={(e) => setSessionData({ ...sessionData, isPrivate: e.target.checked })}
                  className="checkbox-input"
                />
                <label htmlFor="private" className="privacy-label">
                  {sessionData.isPrivate ? <Lock className="privacy-icon" /> : <Globe className="privacy-icon" />}
                  <span>{sessionData.isPrivate ? 'Private Session' : 'Public Session'}</span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-cancel"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="btn btn-create"
              >
                Create Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCreationModel;
