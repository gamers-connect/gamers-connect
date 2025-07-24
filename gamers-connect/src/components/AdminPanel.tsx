'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Eye,
} from 'lucide-react';

interface ContentItem {
  id: number;
  type: 'post' | 'event' | 'session';
  title: string;
  author: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  reportCount: number;
  createdAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'suspended' | 'banned';
  reportCount: number;
  joinDate: string;
  lastActive: string;
}

import type { LucideIcon } from 'lucide-react';
type TabKey = 'overview' | 'content' | 'users' | 'analytics';

const tabs: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: 'overview', label: 'Overview', icon: TrendingUp },
  { key: 'content', label: 'Content Moderation', icon: MessageSquare },
  { key: 'users', label: 'User Management', icon: Users },
  { key: 'analytics', label: 'Analytics', icon: TrendingUp }
];

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'users' | 'analytics'>('overview');

  const mockContent: ContentItem[] = [
    {
      id: 1,
      type: 'post',
      title: 'Looking for Valorant teammates',
      author: 'Alex Chen',
      content: 'Hey everyone, I\'m looking for serious players...',
      status: 'pending',
      reportCount: 0,
      createdAt: '2025-07-21'
    },
    {
      id: 2,
      type: 'event',
      title: 'Unofficial Tournament',
      author: 'Sarah Kim',
      content: 'Organizing a small tournament this weekend...',
      status: 'pending',
      reportCount: 2,
      createdAt: '2025-07-20'
    }
  ];

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'Alex Chen',
      email: 'alex@hawaii.edu',
      status: 'active',
      reportCount: 0,
      joinDate: '2025-01-15',
      lastActive: '2 hours ago'
    },
    {
      id: 2,
      name: 'Problem User',
      email: 'problem@hawaii.edu',
      status: 'active',
      reportCount: 5,
      joinDate: '2025-07-01',
      lastActive: '1 day ago'
    }
  ];

  const analytics = {
    totalUsers: 423,
    activeUsers: 89,
    totalPosts: 1247,
    totalEvents: 56,
    reportedContent: 12,
    pendingReviews: 8
  };

  const OverviewTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Admin Dashboard Overview</h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem' 
      }}>
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Users style={{ height: '1.25rem', width: '1.25rem', color: '#2563eb' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Total Users</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{analytics.totalUsers}</div>
        </div>
        
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: '#10b981', borderRadius: '50%' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Active Users</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{analytics.activeUsers}</div>
        </div>
        
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <MessageSquare style={{ height: '1.25rem', width: '1.25rem', color: '#059669' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Total Posts</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{analytics.totalPosts}</div>
        </div>
        
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Calendar style={{ height: '1.25rem', width: '1.25rem', color: '#7c3aed' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Events</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{analytics.totalEvents}</div>
        </div>
        
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <AlertCircle style={{ height: '1.25rem', width: '1.25rem', color: '#dc2626' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Reported Content</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{analytics.reportedContent}</div>
        </div>
        
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Eye style={{ height: '1.25rem', width: '1.25rem', color: '#ea580c' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Pending Reviews</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{analytics.pendingReviews}</div>
        </div>
      </div>

      <div className="card card-padding">
        <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Recent Activity</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            padding: '0.75rem',
            backgroundColor: '#fefce8',
            borderRadius: '0.5rem'
          }}>
            <AlertCircle style={{ height: '1.25rem', width: '1.25rem', color: '#ca8a04' }} />
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>Content reported by user</p>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Post: &quot; Unofficial Tournament &quot; needs review</p>
            </div>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            padding: '0.75rem',
            backgroundColor: '#f0fdf4',
            borderRadius: '0.5rem'
          }}>
            <CheckCircle style={{ height: '1.25rem', width: '1.25rem', color: '#16a34a' }} />
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>New user registered</p>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>marcus.johnson@hawaii.edu joined the platform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ContentTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Content Moderation</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{ 
            padding: '0.25rem 0.75rem', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            border: 'none',
            cursor: 'pointer'
          }}>All</button>
          <button style={{ 
            padding: '0.25rem 0.75rem', 
            backgroundColor: '#fef3c7', 
            color: '#92400e',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            border: 'none',
            cursor: 'pointer'
          }}>Pending</button>
          <button style={{ 
            padding: '0.25rem 0.75rem', 
            backgroundColor: '#fecaca', 
            color: '#991b1b',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            border: 'none',
            cursor: 'pointer'
          }}>Reported</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {mockContent.map(item => (
          <div key={item.id} className="card card-padding">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    fontSize: '0.75rem', 
                    borderRadius: '9999px',
                    backgroundColor: item.type === 'post' ? '#dbeafe' : item.type === 'event' ? '#e9d5ff' : '#dcfce7',
                    color: item.type === 'post' ? '#1e40af' : item.type === 'event' ? '#7c2d12' : '#166534'
                  }}>
                    {item.type}
                  </span>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    fontSize: '0.75rem', 
                    borderRadius: '9999px',
                    backgroundColor: item.status === 'pending' ? '#fef3c7' : item.status === 'approved' ? '#dcfce7' : '#fecaca',
                    color: item.status === 'pending' ? '#92400e' : item.status === 'approved' ? '#166534' : '#991b1b'
                  }}>
                    {item.status}
                  </span>
                  {item.reportCount > 0 && (
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      fontSize: '0.75rem', 
                      backgroundColor: '#fecaca',
                      color: '#991b1b',
                      borderRadius: '9999px'
                    }}>
                      {item.reportCount} reports
                    </span>
                  )}
                </div>
                <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{item.title}</h4>
                <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.5rem' }}>by {item.author}</p>
                <p style={{ fontSize: '0.875rem', color: '#374151' }}>{item.content}</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem',
                padding: '0.25rem 0.75rem',
                backgroundColor: '#dcfce7',
                color: '#166534',
                borderRadius: '0.25rem',
                border: 'none',
                cursor: 'pointer'
              }}>
                <CheckCircle style={{ height: '1rem', width: '1rem' }} />
                <span>Approve</span>
              </button>
              <button style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem',
                padding: '0.25rem 0.75rem',
                backgroundColor: '#fecaca',
                color: '#991b1b',
                borderRadius: '0.25rem',
                border: 'none',
                cursor: 'pointer'
              }}>
                <XCircle style={{ height: '1rem', width: '1rem' }} />
                <span>Reject</span>
              </button>
              <button style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem',
                padding: '0.25rem 0.75rem',
                backgroundColor: '#f3f4f6',
                color: '#1f2937',
                borderRadius: '0.25rem',
                border: 'none',
                cursor: 'pointer'
              }}>
                <Eye style={{ height: '1rem', width: '1rem' }} />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const UsersTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>User Management</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Search users..."
            style={{ 
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.875rem'
            }}
          />
          <button className="btn btn-primary" style={{ fontSize: '0.875rem' }}>Search</button>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ 
                padding: '0.75rem 1.5rem', 
                textAlign: 'left', 
                fontSize: '0.75rem',
                fontWeight: '500',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>User</th>
              <th style={{ 
                padding: '0.75rem 1.5rem', 
                textAlign: 'left', 
                fontSize: '0.75rem',
                fontWeight: '500',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Status</th>
              <th style={{ 
                padding: '0.75rem 1.5rem', 
                textAlign: 'left', 
                fontSize: '0.75rem',
                fontWeight: '500',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Reports</th>
              <th style={{ 
                padding: '0.75rem 1.5rem', 
                textAlign: 'left', 
                fontSize: '0.75rem',
                fontWeight: '500',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Last Active</th>
              <th style={{ 
                padding: '0.75rem 1.5rem', 
                textAlign: 'left', 
                fontSize: '0.75rem',
                fontWeight: '500',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Actions</th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: 'white' }}>
            {mockUsers.map(user => (
              <tr key={user.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{user.name}</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{user.email}</div>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    fontSize: '0.75rem', 
                    borderRadius: '9999px',
                    backgroundColor: user.status === 'active' ? '#dcfce7' : user.status === 'suspended' ? '#fef3c7' : '#fecaca',
                    color: user.status === 'active' ? '#166534' : user.status === 'suspended' ? '#92400e' : '#991b1b'
                  }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#111827' }}>
                  {user.reportCount > 0 ? (
                    <span style={{ color: '#dc2626', fontWeight: '500' }}>{user.reportCount}</span>
                  ) : (
                    <span style={{ color: '#16a34a' }}>0</span>
                  )}
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>
                  {user.lastActive}
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', fontWeight: '500' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>View</button>
                    <button style={{ color: '#ca8a04', background: 'none', border: 'none', cursor: 'pointer' }}>Suspend</button>
                    <button style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>Ban</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Platform Analytics</h3>
      
      <div className="grid-2">
        <div className="card card-padding">
          <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>User Growth</h4>
          <div style={{ 
            height: '16rem', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <p style={{ color: '#6b7280' }}>Chart placeholder - User registration over time</p>
          </div>
        </div>
        
        <div className="card card-padding">
          <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Content Activity</h4>
          <div style={{ 
            height: '16rem', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <p style={{ color: '#6b7280' }}>Chart placeholder - Posts and events created</p>
          </div>
        </div>
        
        <div className="card card-padding">
          <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Popular Games</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['Valorant', 'Overwatch 2', 'Minecraft', 'League of Legends'].map((game, index) => (
              <div key={game} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{game}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ 
                    width: '5rem', 
                    backgroundColor: '#e5e7eb', 
                    borderRadius: '9999px', 
                    height: '0.5rem',
                    position: 'relative'
                  }}>
                    <div 
                      style={{ 
                        backgroundColor: '#000', 
                        height: '0.5rem', 
                        borderRadius: '9999px',
                        width: `${(4 - index) * 25}%`
                      }}
                    ></div>
                  </div>
                  <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>{89 - index * 20}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card card-padding">
          <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Moderation Stats</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Content Approved</span>
              <span style={{ color: '#16a34a', fontWeight: '500' }}>156</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Content Rejected</span>
              <span style={{ color: '#dc2626', fontWeight: '500' }}>23</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Users Suspended</span>
              <span style={{ color: '#ca8a04', fontWeight: '500' }}>8</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Users Banned</span>
              <span style={{ color: '#dc2626', fontWeight: '500' }}>3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Shield style={{ height: '2rem', width: '2rem', color: '#dc2626' }} />
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>Admin Panel</h1>
      </div>

      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '2rem' }}>
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === key ? '#000' : '#f3f4f6',
              color: activeTab === key ? 'white' : '#374151',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== key) {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== key) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
          >
            <Icon style={{ height: '1rem', width: '1rem' }} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'content' && <ContentTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </div>
    </div>
  );
};

export default AdminPanel;
