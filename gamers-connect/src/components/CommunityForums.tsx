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
    <div className="card card-padding mb-6">
      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Create New Post</h3>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>Forum</label>
          <select style={{
            width: '100%',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            padding: '0.5rem 0.75rem'
          }}>
            {forums.map(forum => (
              <option key={forum.id} value={forum.id}>{forum.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>Title</label>
          <input
            type="text"
            style={{
              width: '100%',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              padding: '0.5rem 0.75rem'
            }}
            placeholder="Enter post title..."
          />
        </div>
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>Content</label>
          <textarea
            rows={6}
            style={{
              width: '100%',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              padding: '0.5rem 0.75rem',
              resize: 'vertical'
            }}
            placeholder="Write your post content..."
          />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setShowCreatePost(false)}
            className="btn btn-secondary"
            style={{ flex: 1, padding: '0.5rem' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ flex: 1, padding: '0.5rem' }}
          >
            Create Post
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>Community Forums</h2>
        <button
          onClick={() => setShowCreatePost(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus style={{ height: '1rem', width: '1rem' }} />
          <span>New Post</span>
        </button>
      </div>

      {showCreatePost && <CreatePostForm />}

      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('forums')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'forums' ? '#000' : '#f3f4f6',
            color: activeTab === 'forums' ? 'white' : '#374151',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'forums') {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'forums') {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }
          }}
        >
          Forums
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'posts' ? '#000' : '#f3f4f6',
            color: activeTab === 'posts' ? 'white' : '#374151',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'posts') {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'posts') {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }
          }}
        >
          Recent Posts
        </button>
      </div>

      {activeTab === 'forums' ? (
        <div className="grid-2">
          {forums.map(forum => (
            <div key={forum.id} className="card card-padding" style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ fontSize: '1.875rem' }}>{forum.icon}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                    {forum.name}
                  </h3>
                  <p style={{ color: '#4b5563', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                    {forum.description}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    fontSize: '0.875rem', 
                    color: '#6b7280' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Users style={{ height: '1rem', width: '1rem' }} />
                      <span>{forum.memberCount} members</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MessageCircle style={{ height: '1rem', width: '1rem' }} />
                      <span>{forum.postCount} posts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {posts.map(post => (
            <div key={post.id} className="card card-padding">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {post.isPinned && <Pin style={{ height: '1rem', width: '1rem', color: '#16a34a' }} />}
                    {post.isHot && <TrendingUp style={{ height: '1rem', width: '1rem', color: '#ef4444' }} />}
                    <h3 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: '600', 
                      cursor: 'pointer',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#4b5563';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#111827';
                    }}
                    >
                      {post.title}
                    </h3>
                  </div>
                  <p style={{ 
                    color: '#4b5563', 
                    fontSize: '0.875rem', 
                    marginBottom: '0.75rem',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {post.content}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    fontSize: '0.875rem', 
                    color: '#6b7280' 
                  }}>
                    <span>by {post.author}</span>
                    <span>in {post.game}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MessageCircle style={{ height: '1rem', width: '1rem' }} />
                      <span>{post.replies} replies</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock style={{ height: '1rem', width: '1rem' }} />
                      <span>{post.lastActivity}</span>
                    </div>
                  </div>
                </div>
                <div style={{ 
                  textAlign: 'right', 
                  fontSize: '0.875rem', 
                  color: '#6b7280' 
                }}>
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
