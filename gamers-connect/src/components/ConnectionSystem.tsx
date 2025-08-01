"use client";
import React, { useState, useEffect } from 'react';
import { UserPlus, UserCheck, UserX, MessageCircle, MapPin, Clock, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

interface ConnectionRequest {
  id: string; // Changed to string
  from: {
    id: string;
    name: string;
  };
  to: {
    id: string;
    name: string;
  };
  message: string;
  timestamp: string; // ISO string
  status: 'pending' | 'accepted' | 'declined';
  games: string[];
  platform: string;
}

interface Connection {
  id: string; // Changed to string
  name: string;
  games: string[];
  platform: string;
  status: 'online' | 'away' | 'offline';
  location: string;
  lastSeen: string; // ISO string or 'Online now'
  rating: number;
  mutualGames: number;
  userId: string; // Added userId for linking to profile
}

const ConnectionSystem: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'requests' | 'connections'>('requests');
  const [showSendRequest, setShowSendRequest] = useState(false);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlayerForRequest, setSelectedPlayerForRequest] = useState<{ id: string; name: string } | null>(null);

  // Fetch data on component mount and when user changes
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        // Fetch connection requests
        const requestsResponse = await api.connections.getAll(user.id, 'all'); // Adjust params as needed
        setRequests(requestsResponse.connections || []); // Adjust based on actual API response structure

        // Fetch connections (accepted)
        const connectionsResponse = await api.connections.getAll(user.id, 'accepted'); // Adjust params as needed
        setConnections(connectionsResponse.connections || []); // Adjust based on actual API response structure
      } catch (err) {
        console.error('Failed to fetch connection data:', err);
        setError('Failed to load connection data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleRequestAction = async (requestId: string, action: 'accept' | 'decline') => {
    if (!user) return;

    try {
      // Optimistically update UI
      setRequests(prev =>
        prev.map(req =>
          req.id === requestId ? { ...req, status: action === 'accept' ? 'accepted' : 'declined' } : req
        )
      );

      // Call API
      const response = await api.connections.respond(requestId, action === 'accept' ? 'ACCEPTED' : 'DECLINED', user.id);

      if (action === 'accept') {
        // Add new connection if the API provides the connection details
        // This depends on your API design. You might need to fetch connections again.
        // For now, we'll just show a success message.
        console.log('Request accepted:', response);
        // Optionally refetch connections here
        // const connectionsResponse = await api.connections.getAll(user.id, 'accepted');
        // setConnections(connectionsResponse.connections || []);
      }
    } catch (err) {
      console.error(`Failed to ${action} request:`, err);
      // Revert optimistic update on error
      setRequests(prev =>
        prev.map(req =>
          req.id === requestId ? { ...req, status: 'pending' } : req
        )
      );
      setError(`Failed to ${action} request.`);
    }
  };

  const handleSendRequest = async (playerId: string, playerName: string, message: string) => {
    if (!user) return;

    try {
      const requestData = {
        fromUserId: user.id, // Current user sends the request
        toUserId: playerId,  // Target player receives the request
        message: message
      };

      const response = await api.connections.send(requestData.fromUserId, requestData.toUserId, requestData.message);

      // Close the modal
      setShowSendRequest(false);
      setSelectedPlayerForRequest(null);
      
      // Optionally show success message
      console.log('Connection request sent:', response);
      
      // Optionally refetch requests to show the new one
      // const requestsResponse = await api.connections.getAll(user.id, 'sent');
      // setRequests(requestsResponse.connections || []);
    } catch (err) {
      console.error('Failed to send connection request:', err);
      setError('Failed to send connection request.');
    }
  };

  const SendConnectionRequest: React.FC<{ 
    playerId: string; 
    playerName: string; 
    onClose: () => void 
  }> = ({ playerId, playerName, onClose }) => {
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSending(true);
      await handleSendRequest(playerId, playerName, message);
      setSending(false);
      onClose();
    };

    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          maxWidth: '28rem',
          width: '100%',
          padding: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
            Send Connection Request
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1rem' }}>
            to {playerName}
          </p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Message (optional)
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                placeholder="Hi! I'd like to connect and play together..."
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={sending}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  cursor: sending ? 'not-allowed' : 'pointer',
                  opacity: sending ? 0.7 : 1
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  cursor: sending ? 'not-allowed' : 'pointer',
                  opacity: sending ? 0.7 : 1
                }}
              >
                {sending ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Format relative time (simplified)
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>Loading connections...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#ef4444',
          padding: '1rem',
          borderRadius: '0.5rem',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            display: 'block',
            margin: '0 auto',
            padding: '0.5rem 1rem',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          Please log in to view your connections.
        </div>
      </div>
    );
  }

  const RequestsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Connection Requests</h3>
        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          {requests.filter(r => r.status === 'pending').length} pending
        </span>
      </div>
      
      {requests.filter(r => r.status === 'pending').length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: '#6b7280',
          border: '1px dashed #d1d5db',
          borderRadius: '0.5rem'
        }}>
          <UserPlus style={{ height: '3rem', width: '3rem', margin: '0 auto 1rem', opacity: 0.5 }} />
          <p>No pending connection requests</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {requests.filter(r => r.status === 'pending').map(request => (
            <div key={request.id} style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    backgroundColor: '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    color: '#4b5563'
                  }}>
                    {request.from.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                      {request.from.name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#6b7280' }}>
                      <span>{request.platform}</span>
                      <span>•</span>
                      <span>{request.games.join(', ')}</span>
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {formatRelativeTime(request.timestamp)}
                </span>
              </div>
              
              {request.message && (
                <div style={{ 
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <p style={{ fontSize: '0.875rem', color: '#374151' }}>&ldquo;{request.message}&ldquo;</p>
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => handleRequestAction(request.id, 'accept')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#059669';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#10b981';
                  }}
                >
                  <UserCheck style={{ height: '1rem', width: '1rem' }} />
                  <span>Accept</span>
                </button>
                <button
                  onClick={() => handleRequestAction(request.id, 'decline')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                >
                  <UserX style={{ height: '1rem', width: '1rem' }} />
                  <span>Decline</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div>
        <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.75rem' }}>
          Recent Activity
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {requests.filter(r => r.status !== 'pending').map(request => (
            <div key={request.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              fontSize: '0.875rem',
              color: '#4b5563',
              padding: '0.5rem'
            }}>
              {request.status === 'accepted' ? (
                <UserCheck style={{ height: '1rem', width: '1rem', color: '#10b981' }} />
              ) : (
                <UserX style={{ height: '1rem', width: '1rem', color: '#ef4444' }} />
              )}
              <span style={{ flex: 1 }}>
                You {request.status} a connection request from <strong>{request.from.name}</strong>
              </span>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                {formatRelativeTime(request.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ConnectionsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Your Connections</h3>
        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          {connections.filter(c => c.status === 'online').length} online
        </span>
      </div>
      
      {connections.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: '#6b7280',
          border: '1px dashed #d1d5db',
          borderRadius: '0.5rem'
        }}>
          <UserPlus style={{ height: '3rem', width: '3rem', margin: '0 auto 1rem', opacity: 0.5 }} />
          <p>You have no connections yet.</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Send a connection request to start playing together!</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {connections.map(connection => (
            <div key={connection.id} style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '50%',
                      backgroundColor: '#e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      color: '#4b5563'
                    }}>
                      {connection.name.charAt(0)}
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '0.75rem',
                      height: '0.75rem',
                      borderRadius: '50%',
                      border: '2px solid white',
                      backgroundColor: connection.status === 'online' ? '#10b981' : 
                                     connection.status === 'away' ? '#f59e0b' : 
                                     '#9ca3af'
                    }} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                      {connection.name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Star style={{ height: '0.875rem', width: '0.875rem', color: '#fbbf24' }} />
                      <span style={{ fontSize: '0.8125rem', color: '#4b5563' }}>
                        {connection.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  backgroundColor: connection.status === 'online' ? 'rgba(16, 185, 129, 0.1)' : 
                                 connection.status === 'away' ? 'rgba(245, 158, 11, 0.1)' : 
                                 'rgba(156, 163, 175, 0.1)',
                  color: connection.status === 'online' ? '#047857' : 
                         connection.status === 'away' ? '#92400e' : 
                         '#4b5563',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {connection.status}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#4b5563' }}>
                  <span>🎮</span>
                  <span>{connection.games.join(', ')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#4b5563' }}>
                  <MapPin style={{ height: '0.875rem', width: '0.875rem' }} />
                  <span>{connection.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#4b5563' }}>
                  <Clock style={{ height: '0.875rem', width: '0.875rem' }} />
                  <span>{connection.lastSeen === 'Online now' ? connection.lastSeen : formatRelativeTime(connection.lastSeen)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#4b5563' }}>
                  <span>🤝</span>
                  <span>{connection.mutualGames} shared games</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  flex: 1,
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                }}
                >
                  <MessageCircle style={{ height: '1rem', width: '1rem' }} />
                  <span>Message</span>
                </button>
                <button style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
                >
                  Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '1.5rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1.5rem' 
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Connections</h2>
        <button
          onClick={() => {
            // This would typically open a search/modal to select a player
            // For now, we'll just show the modal with a placeholder
            setSelectedPlayerForRequest({ id: 'placeholder', name: 'Player Name' });
            setShowSendRequest(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
          }}
        >
          <UserPlus style={{ height: '1rem', width: '1rem' }} />
          <span>Send Request</span>
        </button>
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: '0.25rem', 
        marginBottom: '1.5rem',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <button
          onClick={() => setActiveTab('requests')}
          style={{
            padding: '0.75rem 1.25rem',
            borderBottom: activeTab === 'requests' ? '2px solid #3b82f6' : 'none',
            backgroundColor: 'transparent',
            color: activeTab === 'requests' ? '#3b82f6' : '#6b7280',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Requests ({requests.filter(r => r.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveTab('connections')}
          style={{
            padding: '0.75rem 1.25rem',
            borderBottom: activeTab === 'connections' ? '2px solid #3b82f6' : 'none',
            backgroundColor: 'transparent',
            color: activeTab === 'connections' ? '#3b82f6' : '#6b7280',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Connections ({connections.length})
        </button>
      </div>
      
      {activeTab === 'requests' ? <RequestsTab /> : <ConnectionsTab />}
      
      {showSendRequest && selectedPlayerForRequest && (
        <SendConnectionRequest
          playerId={selectedPlayerForRequest.id}
          playerName={selectedPlayerForRequest.name}
          onClose={() => {
            setShowSendRequest(false);
            setSelectedPlayerForRequest(null);
          }}
        />
      )}
    </div>
  );
};

export default ConnectionSystem;
