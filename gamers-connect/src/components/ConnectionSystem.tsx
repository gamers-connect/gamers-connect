"use client";

import React, { useState } from 'react';
import { UserPlus, UserCheck, UserX, MessageCircle, MapPin, Clock, Star } from 'lucide-react';

interface ConnectionRequest {
  id: number;
  from: string;
  to: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined';
  games: string[];
  platform: string;
}

interface Connection {
  id: number;
  name: string;
  games: string[];
  platform: string;
  status: 'online' | 'away' | 'offline';
  location: string;
  lastSeen: string;
  rating: number;
  mutualGames: number;
}

const ConnectionSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'connections'>('requests');
  const [showSendRequest, setShowSendRequest] = useState(false);

  const [requests, setRequests] = useState<ConnectionRequest[]>([
    {
      id: 1,
      from: 'Alex Chen',
      to: 'Current User',
      message: 'Hey! I saw you play Valorant competitively. Want to team up for ranked?',
      timestamp: '2 hours ago',
      status: 'pending',
      games: ['Valorant', 'Overwatch 2'],
      platform: 'PC'
    },
    {
      id: 2,
      from: 'Sarah Kim',
      to: 'Current User',
      message: 'Looking for Minecraft building partners!',
      timestamp: '1 day ago',
      status: 'pending',
      games: ['Minecraft'],
      platform: 'PC'
    }
  ]);

  const [connections, setConnections] = useState<Connection[]>([
    {
      id: 1,
      name: 'Marcus Johnson',
      games: ['Apex Legends', 'Rocket League'],
      platform: 'PC',
      status: 'online',
      location: 'UH West Oahu',
      lastSeen: 'Online now',
      rating: 4.7,
      mutualGames: 2
    },
    {
      id: 2,
      name: 'Luna Patel',
      games: ['League of Legends', 'Valorant'],
      platform: 'PC',
      status: 'away',
      location: 'UH Mānoa Campus',
      lastSeen: '30 minutes ago',
      rating: 4.6,
      mutualGames: 1
    }
  ]);

  const handleRequestAction = (requestId: number, action: 'accept' | 'decline') => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: action === 'accept' ? 'accepted' : 'declined' } : req
      )
    );
    
    if (action === 'accept') {
      const request = requests.find(r => r.id === requestId);
      if (request) {
        const newConnection: Connection = {
          id: Date.now(),
          name: request.from,
          games: request.games,
          platform: request.platform,
          status: 'online',
          location: 'UH Campus',
          lastSeen: 'Online now',
          rating: 4.5,
          mutualGames: request.games.length
        };
        setConnections(prev => [...prev, newConnection]);
      }
    }
  };

  const SendConnectionRequest: React.FC<{ playerName: string; onClose: () => void }> = ({ 
    playerName, 
    onClose 
  }) => {
    const [message, setMessage] = useState('');
    
    const handleSend = () => {
      // In real app, this would send API request
      console.log('Sending connection request to', playerName, 'with message:', message);
      onClose();
    };

    return (
      <div className="modal">
        <div className="modal-content">
          <h3 className="text-lg font-semibold mb-4">Send Connection Request</h3>
          <p className="text-sm text-gray-600 mb-4">to {playerName}</p>
          
          <div className="form-group">
            <label className="form-label">
              Message (optional)
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="textarea"
              placeholder="Hi! I'd like to connect and play together..."
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="btn btn-primary flex-1"
            >
              Send Request
            </button>
          </div>
        </div>
      </div>
    );
  };

  const RequestsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Connection Requests</h3>
        <span className="text-sm text-gray-500">
          {requests.filter(r => r.status === 'pending').length} pending
        </span>
      </div>

      {requests.filter(r => r.status === 'pending').length === 0 ? (
        <div className="empty-state">
          <UserPlus className="empty-icon" />
          <p>No pending connection requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.filter(r => r.status === 'pending').map(request => (
            <div key={request.id} className="card card-padding">
              <div className="card-header">
                <div className="user-info">
                  <div className="avatar">
                    {request.from.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{request.from}</h4>
                    <div className="user-meta">
                      <span>{request.platform}</span>
                      <span>•</span>
                      <span>{request.games.join(', ')}</span>
                    </div>
                  </div>
                </div>
                <span className="timestamp">{request.timestamp}</span>
              </div>

              {request.message && (
                <div className="message-box">
                  <p className="text-sm text-gray-700">&quot;{request.message}&quot;</p>
                </div>
              )}

              <div className="button-group">
                <button
                  onClick={() => handleRequestAction(request.id, 'accept')}
                  className="btn btn-success btn-flex"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Accept</span>
                </button>
                <button
                  onClick={() => handleRequestAction(request.id, 'decline')}
                  className="btn btn-secondary btn-flex"
                >
                  <UserX className="h-4 w-4" />
                  <span>Decline</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="activity-section">
        <h4 className="activity-title">Recent Activity</h4>
        <div className="space-y-2">
          {requests.filter(r => r.status !== 'pending').map(request => (
            <div key={request.id} className="activity-item">
              {request.status === 'accepted' ? (
                <UserCheck className="activity-icon activity-accepted" />
              ) : (
                <UserX className="activity-icon activity-declined" />
              )}
              <span>
                You {request.status} a connection request from <strong>{request.from}</strong>
              </span>
              <span className="timestamp">{request.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ConnectionsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Your Connections</h3>
        <span className="text-sm text-gray-500">
          {connections.filter(c => c.status === 'online').length} online
        </span>
      </div>

      <div className="connections-grid">
        {connections.map(connection => (
          <div key={connection.id} className="card card-padding">
            <div className="card-header">
              <div className="user-info">
                <div className="avatar-container">
                  <div className="avatar">
                    {connection.name.charAt(0)}
                  </div>
                  <div className={`status-dot status-${connection.status}`} />
                </div>
                <div>
                  <h4 className="font-semibold">{connection.name}</h4>
                  <div className="rating">
                    <Star className="star-icon" />
                    <span className="text-sm text-gray-600">{connection.rating}</span>
                  </div>
                </div>
              </div>
              <span className={`status-badge status-badge-${connection.status}`}>
                {connection.status}
              </span>
            </div>

            <div className="connection-info">
              <div className="info-item">
                <span>🎮</span>
                <span>{connection.games.join(', ')}</span>
              </div>
              <div className="info-item">
                <MapPin className="info-icon" />
                <span>{connection.location}</span>
              </div>
              <div className="info-item">
                <Clock className="info-icon" />
                <span>{connection.lastSeen}</span>
              </div>
              <div className="info-item">
                <span>🤝</span>
                <span>{connection.mutualGames} shared games</span>
              </div>
            </div>

            <div className="button-group">
              <button className="btn btn-primary btn-flex">
                <MessageCircle className="h-4 w-4" />
                <span>Message</span>
              </button>
              <button className="btn btn-outline">
                Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="header">
        <h2 className="title">Connections</h2>
        <button
          onClick={() => setShowSendRequest(true)}
          className="btn btn-primary"
        >
          <UserPlus className="h-4 w-4" />
          <span>Send Request</span>
        </button>
      </div>

      <div className="tabs">
        <button
          onClick={() => setActiveTab('requests')}
          className={`tab ${activeTab === 'requests' ? 'tab-active' : ''}`}
        >
          Requests ({requests.filter(r => r.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveTab('connections')}
          className={`tab ${activeTab === 'connections' ? 'tab-active' : ''}`}
        >
          Connections ({connections.length})
        </button>
      </div>

      {activeTab === 'requests' ? <RequestsTab /> : <ConnectionsTab />}

      {showSendRequest && (
        <SendConnectionRequest
          playerName="Alex Chen"
          onClose={() => setShowSendRequest(false)}
        />
      )}
    </div>
  );
};

export default ConnectionSystem;
