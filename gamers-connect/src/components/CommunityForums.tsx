"use client";

import React, { useState } from 'react';
import { MessageCircle, Users, Plus, Pin, TrendingUp, Clock } from 'lucide-react';

interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: string;
  game: string;
  replies: number;
  views: number;
  lastActivity: string;
  isPinned?: boolean;
  isHot?: boolean;
}

interface Forum {
  id: string;
  name: string;
  description: string;
  game?: string;
  memberCount: number;
  postCount: number;
  icon: string;
}

const CommunityForums: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'forums' | 'posts'>('forums');
  const [selectedForum, setSelectedForum] = useState<string>('');
  const [showCreatePost, setShowCreatePost] = useState(false);

  const forums: Forum[] = [
    {
      id: 'valorant',
      name: 'Valorant Community',
      description: 'Discuss strategies, find teammates, and share highlights',
      game: 'Valorant',
      memberCount: 245,
      postCount: 1892,
      icon: '🎯'
    },
    {
      id: 'overwatch',
      name: 'Overwatch 2',
      description: 'Team compositions, hero guides, and competitive discussion',
      game: 'Overwatch 2',
      memberCount: 189,
      postCount: 1456,
      icon: '🦾'
    },
    {
      id: 'minecraft',
      name: 'Minecraft Builders',
      description: 'Share your builds, collaborate on projects',
      game: 'Minecraft',
      memberCount: 156,
      postCount: 987,
      icon: '🧱'
    },
    {
      id: 'general',
      name: 'General Gaming',
      description: 'General gaming discussion and community chat',
      memberCount: 423,
      postCount: 2845,
      icon: '🎮'
    }
  ];

  const posts: ForumPost[] = [
    {
      id: 1,
      title: 'Looking for Valorant team for next tournament',
      content: 'Hey everyone! I\'m looking for serious players to form a team...',
      author: 'Alex Chen',
      game: 'Valorant',
      replies: 12,
      views: 89,
      lastActivity: '2 hours ago',
      isHot: true
    },
    {
      id: 2,
      title: 'Best Overwatch 2 team compositions for ranked',
      content: 'What are your thoughts on the current meta?',
      author: 'Sarah Kim',
      game: 'Overwatch 2',
      replies: 24,
      views: 156,
      lastActivity: '4 hours ago',
      isPinned: true
    },
    {
      id: 3,
      title: 'UH Gaming Club Tournament Schedule',
      content: 'Official tournament dates and registration info',
      author: 'Gaming Club Admin',
      game: 'General',
      replies: 8,
      views: 234,
      lastActivity: '1 day ago',
      isPinned: true
    }
  ];

  const CreatePostForm: React.FC = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Create New Post</h3>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Forum</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
            {forums.map(forum => (
              <option key={forum.id} value={forum.id}>{forum.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Enter post title..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <textarea
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Write your post content..."
          />
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setShowCreatePost(false)}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          >
            Create Post
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Community Forums</h2>
        <button
          onClick={() => setShowCreatePost(true)}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Post</span>
        </button>
      </div>

      {showCreatePost && <CreatePostForm />}

      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('forums')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'forums' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          Forums
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'posts' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          Recent Posts
        </button>
      </div>

      {activeTab === 'forums' ? (
        <div className="grid md:grid-cols-2 gap-6">
          {forums.map(forum => (
            <div key={forum.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{forum.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{forum.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{forum.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{forum.memberCount} members</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{forum.postCount} posts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {post.isPinned && <Pin className="h-4 w-4 text-green-600" />}
                    {post.isHot && <TrendingUp className="h-4 w-4 text-red-500" />}
                    <h3 className="text-lg font-semibold hover:text-gray-600 cursor-pointer">
                      {post.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>by {post.author}</span>
                    <span>in {post.game}</span>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.replies} replies</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.lastActivity}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div>{post.views} views</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityForums;