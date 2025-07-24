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

export const ConnectionSystem: React.FC = () => {
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
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <h3 className="text-lg font-semibold mb-4">Send Connection Request</h3>
          <p className="text-sm text-gray-600 mb-4">to {playerName}</p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (optional)
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Hi! I'd like to connect and play together..."
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800"
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
        <div className="text-center py-8 text-gray-500">
          <UserPlus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No pending connection requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.filter(r => r.status === 'pending').map(request => (
            <div key={request.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">
                    {request.from.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{request.from}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{request.platform}</span>
                      <span>•</span>
                      <span>{request.games.join(', ')}</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{request.timestamp}</span>
              </div>

              {request.message && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700">"{request.message}"</p>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => handleRequestAction(request.id, 'accept')}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-1"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Accept</span>
                </button>
                <button
                  onClick={() => handleRequestAction(request.id, 'decline')}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-1"
                >
                  <UserX className="h-4 w-4" />
                  <span>Decline</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Activity */}
      <div className="mt-8">
        <h4 className="font-medium text-gray-700 mb-3">Recent Activity</h4>
        <div className="space-y-2">
          {requests.filter(r => r.status !== 'pending').map(request => (
            <div key={request.id} className="flex items-center space-x-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              {request.status === 'accepted' ? (
                <UserCheck className="h-4 w-4 text-green-600" />
              ) : (
                <UserX className="h-4 w-4 text-red-600" />
              )}
              <span>
                You {request.status} a connection request from <strong>{request.from}</strong>
              </span>
              <span className="text-xs">{request.timestamp}</span>
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

      <div className="grid md:grid-cols-2 gap-4">
        {connections.map(connection => (
          <div key={connection.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">
                    {connection.name.charAt(0)}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    connection.status === 'online' ? 'bg-green-500' :
                    connection.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                </div>
                <div>
                  <h4 className="font-semibold">{connection.name}</h4>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{connection.rating}</span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                connection.status === 'online' ? 'bg-green-100 text-green-800' :
                connection.status === 'away' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {connection.status}
              </span>
            </div>

            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span>🎮</span>
                <span>{connection.games.join(', ')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-3 w-3" />
                <span>{connection.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-3 w-3" />
                <span>{connection.lastSeen}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🤝</span>
                <span>{connection.mutualGames} shared games</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 flex items-center justify-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>Message</span>
              </button>
              <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Connections</h2>
        <button
          onClick={() => setShowSendRequest(true)}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center space-x-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Send Request</span>
        </button>
      </div>

      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'requests' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Requests ({requests.filter(r => r.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveTab('connections')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'connections' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
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
