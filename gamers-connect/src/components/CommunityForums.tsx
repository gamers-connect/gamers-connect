/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import { MessageCircle, Users, Plus, Pin, TrendingUp, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  game?: string;
  replies: number;
  views: number;
  lastActivity: string;
  isPinned?: boolean;
  isHot?: boolean;
  forumId: string;
  createdAt: string;
}

interface Forum {
  id: string;
  name: string;
  description: string;
  game?: string;
  memberCount: number;
  postCount: number;
  icon: string;
  lastActivity?: string;
}

const CommunityForums: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'forums' | 'posts'>('forums');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forums, setForums] = useState<Forum[]>([
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
  ]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPosts(true);
        const postsResponse = await api.forum.getPosts({ limit: 10 });
        setPosts(postsResponse.posts);
      } catch (err) {
        console.error('Failed to fetch recent posts:', err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchData();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to create a post.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const postData = {
        forumId: formData.get('forum') as string,
        title: formData.get('title') as string,
        content: formData.get('content') as string,
      };

      if (!postData.forumId || !postData.title || !postData.content) {
        throw new Error('Please fill in all required fields.');
      }

      const response = await api.forum.createPost(postData);

      const newPost: ForumPost = {
        id: response.id,
        title: response.title,
        content: response.content,
        author: { id: user.id, name: user.name },
        game: response.forum?.game,
        replies: 0,
        views: 0,
        lastActivity: response.createdAt,
        createdAt: response.createdAt,
        forumId: response.forumId,
      };

      setPosts(prevPosts => [newPost, ...prevPosts]);
      setShowCreatePost(false);
    } catch (err: any) {
      console.error('Failed to create post:', err);
      setError(err.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const CreatePostForm: React.FC = () => (
    <div style={{
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
        Create New Post
      </h3>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#ef4444',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Forum *
          </label>
          <select
            name="forum"
            required
            style={{
              width: '100%',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              fontSize: '0.875rem',
              backgroundColor: 'white'
            }}
          >
            <option value="">Select a forum</option>
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
          }}>
            Title *
          </label>
          <input
            type="text"
            name="title"
            required
            disabled={loading}
            style={{
              width: '100%',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              fontSize: '0.875rem'
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
          }}>
            Content *
          </label>
          <textarea
            name="content"
            required
            rows={6}
            disabled={loading}
            style={{
              width: '100%',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              fontSize: '0.875rem',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            placeholder="Write your post content..."
          />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setShowCreatePost(false)}
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );

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

  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>Community Forums</h2>
        <button
          onClick={() => {
            if (!user) {
              router.push('/login');
              return;
            }
            setShowCreatePost(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
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
            backgroundColor: activeTab === 'forums' ? '#1f2937' : '#f3f4f6',
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
            backgroundColor: activeTab === 'posts' ? '#1f2937' : '#f3f4f6',
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {forums.map(forum => (
            <div
              key={forum.id}
              style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
              }}
              onClick={() => router.push(`/forums/${forum.id}`)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ fontSize: '1.875rem' }}>{forum.icon}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem', color: '#111827' }}>
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
                  {forum.lastActivity && (
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                      Last activity: {formatRelativeTime(forum.lastActivity)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {loadingPosts ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>Loading posts...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {posts.map(post => (
                <div
                  key={post.id}
                  style={{
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        {post.isPinned && <Pin style={{ height: '1rem', width: '1rem', color: '#16a34a' }} />}
                        {post.isHot && <TrendingUp style={{ height: '1rem', width: '1rem', color: '#ef4444' }} />}
                        <h3 style={{
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          color: '#111827',
                          cursor: 'pointer',
                          transition: 'color 0.2s ease'
                        }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#4b5563';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#111827';
                          }}
                          onClick={() => router.push(`/forums/post/${post.id}`)}
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
                        {post.content.substring(0, 150)}{(post.content.length > 150) ? '...' : ''}
                      </p>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        fontSize: '0.875rem',
                        color: '#6b7280'
                      }}>
                        <span>by {post.author.name}</span>
                        {post.game && <span>in {post.game}</span>}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MessageCircle style={{ height: '1rem', width: '1rem' }} />
                          <span>{post.replies} replies</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock style={{ height: '1rem', width: '1rem' }} />
                          <span>{formatRelativeTime(post.lastActivity)}</span>
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
      )}
    </div>
  );
};

export default CommunityForums;
