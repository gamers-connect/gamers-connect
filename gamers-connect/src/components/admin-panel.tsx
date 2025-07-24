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
  Ban,
  Trash2
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

export const AdminPanel: React.FC = () => {
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
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Admin Dashboard Overview</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium">Total Users</span>
          </div>
          <div className="text-2xl font-bold">{analytics.totalUsers}</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-sm font-medium">Active Users</span>
          </div>
          <div className="text-2xl font-bold">{analytics.activeUsers}</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium">Total Posts</span>
          </div>
          <div className="text-2xl font-bold">{analytics.totalPosts}</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium">Events</span>
          </div>
          <div className="text-2xl font-bold">{analytics.totalEvents}</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium">Reported Content</span>
          </div>
          <div className="text-2xl font-bold">{analytics.reportedContent}</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center space-x-2 mb-2">
            <Eye className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium">Pending Reviews</span>
          </div>
          <div className="text-2xl font-bold">{analytics.pendingReviews}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="text-lg font-semibold mb-4">Recent Activity</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium">Content reported by user</p>
              <p className="text-xs text-gray-500">Post: &quot; Unofficial Tournament &quot; needs review</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium">New user registered</p>
              <p className="text-xs text-gray-500">marcus.johnson@hawaii.edu joined the platform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ContentTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Content Moderation</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-gray-100 rounded text-sm">All</button>
          <button className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">Pending</button>
          <button className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm">Reported</button>
        </div>
      </div>

      <div className="space-y-4">
        {mockContent.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.type === 'post' ? 'bg-blue-100 text-blue-800' :
                    item.type === 'event' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.type}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    item.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </span>
                  {item.reportCount > 0 && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      {item.reportCount} reports
                    </span>
                  )}
                </div>
                <h4 className="font-semibold mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600 mb-2">by {item.author}</p>
                <p className="text-sm text-gray-700">{item.content}</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200">
                <CheckCircle className="h-4 w-4" />
                <span>Approve</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200">
                <XCircle className="h-4 w-4" />
                <span>Reject</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">
                <Eye className="h-4 w-4" />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const UsersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">User Management</h3>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search users..."
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <button className="px-3 py-2 bg-black text-white rounded-lg text-sm">Search</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reports</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockUsers.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' :
                    user.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.reportCount > 0 ? (
                    <span className="text-red-600 font-medium">{user.reportCount}</span>
                  ) : (
                    <span className="text-green-600">0</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastActive}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">View</button>
                  <button className="text-yellow-600 hover:text-yellow-900">Suspend</button>
                  <button className="text-red-600 hover:text-red-900">Ban</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Platform Analytics</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold mb-4">User Growth</h4>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart placeholder - User registration over time</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold mb-4">Content Activity</h4>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart placeholder - Posts and events created</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold mb-4">Popular Games</h4>
          <div className="space-y-3">
            {['Valorant', 'Overwatch 2', 'Minecraft', 'League of Legends'].map((game, index) => (
              <div key={game} className="flex justify-between items-center">
                <span>{game}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-black h-2 rounded-full" 
                      style={{ width: `${(4 - index) * 25}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{89 - index * 20}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold mb-4">Moderation Stats</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Content Approved</span>
              <span className="text-green-600 font-medium">156</span>
            </div>
            <div className="flex justify-between">
              <span>Content Rejected</span>
              <span className="text-red-600 font-medium">23</span>
            </div>
            <div className="flex justify-between">
              <span>Users Suspended</span>
              <span className="text-yellow-600 font-medium">8</span>
            </div>
            <div className="flex justify-between">
              <span>Users Banned</span>
              <span className="text-red-600 font-medium">3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center space-x-3 mb-8">
        <Shield className="h-8 w-8 text-red-600" />
        <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
      </div>

      <div className="flex space-x-1 mb-8">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              activeTab === key ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Icon className="h-4 w-4" />
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