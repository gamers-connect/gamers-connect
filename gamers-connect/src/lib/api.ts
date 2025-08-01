/* eslint-disable @typescript-eslint/no-explicit-any */
// API Client Service for Frontend Components

// Define interfaces for API response data
export interface UserProfile {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    bio?: string;
    discord?: string;
    location?: string;
    games: string[];
    platforms: string[];
    playstyle?: string;
    status?: string;
    lastActive?: string;
    createdAt?: string;
}

export interface Event {
    id: string;
    title: string;
    description?: string;
    game: string;
    date: string;
    time: string;
    location: string;
    type: 'TOURNAMENT' | 'MEETUP' | 'CONTEST' | 'SCRIMMAGE';
    maxAttendees: number;
}

export interface Session {
    id: string;
    title: string;
    description?: string;
    game: string;
    platform: string;
    skillLevel?: string;
    maxPlayers: number;
    isPrivate: boolean;
    date: string;
    time: string;
    hostId: string;
    host: { name: string };
    memberCount: number;
}

class ApiClient {
    private baseUrl: string;
    private token: string | null = null;

    constructor(baseUrl: string = '') {
        this.baseUrl = baseUrl;

        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('auth_token');
        }
    }

    setToken(token: string) {
        this.token = token;
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
        }
    }

    clearToken() {
        this.token = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
        }
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}/api${endpoint}`;

        const headers = new Headers(options.headers);

        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }

        if (this.token) {
            headers.set('Authorization', `Bearer ${this.token}`);
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Network error' }));
            throw new Error(error.error || `HTTP ${response.status}`);
        }

        return response.json();
    }

    // Authentication API
    auth = {
        register: async (userData: {
            email: string;
            password: string;
            name: string;
            avatar?: string;
            games?: string[];
            platforms?: string[];
            playstyle?: string;
            location?: string;
        }) => {
            const response = await this.request<{
                user: UserProfile;
                token: string;
                message: string;
            }>('/auth', {
                method: 'POST',
                body: JSON.stringify(userData),
            });

            if (response.token) {
                this.setToken(response.token);
            }

            return response;
        },

        login: async (credentials: { email: string; password: string }) => {
            const response = await this.request<{
                user: UserProfile;
                token: string;
                message: string;
            }>('/auth', {
                method: 'PUT',
                body: JSON.stringify(credentials),
            });

            if (response.token) {
                this.setToken(response.token);
            }

            return response;
        },

        logout: async () => {
            await this.request('/auth', { method: 'DELETE' });
            this.clearToken();
        },

        getProfile: async () => {
            return this.request<UserProfile>('/auth/profile');
        },
    };

    // Users API
    users = {
        getAll: async (params?: {
            game?: string;
            platform?: string;
            playstyle?: string;
            status?: string;
            limit?: number;
            offset?: number;
        }) => {
            const searchParams = new URLSearchParams();
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined) {
                        searchParams.set(key, value.toString());
                    }
                });
            }

            return this.request<{
                users: UserProfile[];
                pagination: unknown;
            }>(`/users?${searchParams}`);
        },

        getById: async (id: string) => {
            return this.request<UserProfile>(`/users/${id}`);
        },

        update: async (id: string, userData: Partial<UserProfile>) => {
            return this.request<UserProfile>(`/users/${id}`, {
                method: 'PUT',
                body: JSON.stringify(userData),
            });
        },

        deactivate: async (id: string) => {
            return this.request<{ message: string }>(`/users/${id}`, {
                method: 'DELETE',
            });
        },
    };

    // Events API
    events = {
        getAll: async (params?: {
            game?: string;
            type?: string;
            status?: string;
            upcoming?: boolean;
            limit?: number;
            offset?: number;
        }) => {
            const searchParams = new URLSearchParams();
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined) {
                        searchParams.set(key, value.toString());
                    }
                });
            }

            return this.request<{
                events: Event[];
                pagination: unknown;
            }>(`/events?${searchParams}`);
        },

        getById: async (id: string) => {
            return this.request<Event>(`/events/${id}`);
        },

        create: async (eventData: {
            title: string;
            description?: string;
            game: string;
            date: string;
            time: string;
            location: string;
            type: 'TOURNAMENT' | 'MEETUP' | 'CONTEST' | 'SCRIMMAGE';
            maxAttendees: number;
        }) => {
            return this.request<Event>('/events', {
                method: 'POST',
                body: JSON.stringify(eventData),
            });
        },

        update: async (id: string, eventData: Partial<Event>) => {
            return this.request<Event>(`/events/${id}`, {
                method: 'PUT',
                body: JSON.stringify(eventData),
            });
        },

        delete: async (id: string) => {
            return this.request<{ message: string }>(`/events/${id}`, {
                method: 'DELETE',
            });
        },

        join: async (eventId: string, userId: string) => {
            return this.request<any>(`/events/${eventId}/attendees`, {
                method: 'POST',
                body: JSON.stringify({ userId }),
            });
        },

        leave: async (eventId: string, userId: string) => {
            return this.request<{ message: string }>(`/events/${eventId}/attendees?userId=${userId}`, {
                method: 'DELETE',
            });
        },
    };

    // Gaming Sessions API
    sessions = {
        getAll: async (params?: {
            game?: string;
            platform?: string;
            skillLevel?: string;
            status?: string;
            hostId?: string;
            userId?: string;
            limit?: number;
            offset?: number;
        }) => {
            const searchParams = new URLSearchParams();
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined) {
                        searchParams.set(key, value.toString());
                    }
                });
            }

            return this.request<{
                sessions: Session[];
                pagination: unknown;
            }>(`/sessions?${searchParams}`);
        },

        getById: async (id: string, userId?: string) => {
            const url = userId ? `/sessions/${id}?userId=${userId}` : `/sessions/${id}`;
            return this.request<Session>(url);
        },

        create: async (sessionData: {
            title: string;
            description?: string;
            game: string;
            platform: string;
            skillLevel?: string;
            maxPlayers: number;
            isPrivate: boolean;
            date: string;
            time: string;
            hostId: string;
        }) => {
            return this.request<Session>('/sessions', {
                method: 'POST',
                body: JSON.stringify(sessionData),
            });
        },

        update: async (id: string, sessionData: Partial<Session>, hostId: string) => {
            return this.request<Session>(`/sessions/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ ...sessionData, hostId }),
            });
        },

        delete: async (id: string, hostId: string) => {
            return this.request<{ message: string }>(`/sessions/${id}?hostId=${hostId}`, {
                method: 'DELETE',
            });
        },

        join: async (sessionId: string, userId: string) => {
            return this.request<any>(`/sessions/${sessionId}/members`, {
                method: 'POST',
                body: JSON.stringify({ userId }),
            });
        },

        leave: async (sessionId: string, userId: string) => {
            return this.request<{ message: string }>(`/sessions/${sessionId}/members?userId=${userId}`, {
                method: 'DELETE',
            });
        },

        kick: async (sessionId: string, userId: string, hostId: string) => {
            return this.request<{ message: string }>(`/sessions/${sessionId}/members?userId=${userId}&hostId=${hostId}`, {
                method: 'DELETE',
            });
        },
    };

    // Connections API
    connections = {
        getAll: async (userId: string, type?: 'sent' | 'received' | 'accepted' | 'all', status?: string) => {
            const searchParams = new URLSearchParams({ userId });
            if (type) searchParams.set('type', type);
            if (status) searchParams.set('status', status);

            return this.request<{ connections: any[] }>(`/connections?${searchParams}`);
        },

        send: async (fromUserId: string, toUserId: string, message?: string) => {
            return this.request<any>('/connections', {
                method: 'POST',
                body: JSON.stringify({ fromUserId, toUserId, message }),
            });
        },

        respond: async (connectionId: string, status: 'ACCEPTED' | 'DECLINED', userId: string) => {
            return this.request<any>(`/connections/${connectionId}`, {
                method: 'PUT',
                body: JSON.stringify({ status, userId }),
            });
        },

        remove: async (connectionId: string, userId: string) => {
            return this.request<{ message: string }>(`/connections/${connectionId}?userId=${userId}`, {
                method: 'DELETE',
            });
        },
    };

    // Forum API
    forum = {
        getPosts: async (params?: {
            game?: string;
            sortBy?: 'recent' | 'popular' | 'replies' | 'pinned';
            authorId?: string;
            limit?: number;
            offset?: number;
        }) => {
            const searchParams = new URLSearchParams();
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined) {
                        searchParams.set(key, value.toString());
                    }
                });
            }

            return this.request<{
                posts: any[];
                pagination: any;
            }>(`/forum?${searchParams}`);
        },

        createPost: async (postData: {
            title: string;
            content: string;
            game?: string;
        }) => {
            return this.request<any>('/forum', {
                method: 'POST',
                body: JSON.stringify(postData),
            });
        },
    };

    // Notifications API
    notifications = {
        getAll: async (params?: {
            unreadOnly?: boolean;
            limit?: number;
            offset?: number;
        }) => {
            const searchParams = new URLSearchParams();
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined) {
                        searchParams.set(key, value.toString());
                    }
                });
            }

            return this.request<{
                notifications: any[];
                unreadCount: number;
                pagination: any;
            }>(`/notifications?${searchParams}`);
        },

        markAsRead: async (notificationIds?: string[], markAll?: boolean) => {
            return this.request<{ message: string }>('/notifications', {
                method: 'PUT',
                body: JSON.stringify({ notificationIds, markAll }),
            });
        },

        delete: async (notificationId?: string, deleteAll?: boolean) => {
            const searchParams = new URLSearchParams();
            if (notificationId) searchParams.set('id', notificationId);
            if (deleteAll) searchParams.set('deleteAll', 'true');

            return this.request<{ message: string }>(`/notifications?${searchParams}`, {
                method: 'DELETE',
            });
        },
    };

    // Admin API (requires admin permissions)
    admin = {
        getStats: async () => {
            return this.request<{
                stats: any;
                recentActivity: any;
            }>('/admin');
        },

        moderateContent: async (contentId: string, contentType: 'POST' | 'EVENT' | 'SESSION', action: 'APPROVE' | 'REJECT', reason?: string) => {
            return this.request<{ message: string }>('/admin', {
                method: 'POST',
                body: JSON.stringify({
                    operationType: 'moderate_content',
                    contentId,
                    contentType,
                    action,
                    reason,
                }),
            });
        },

        moderateUser: async (userId: string, action: 'SUSPEND' | 'UNSUSPEND' | 'BAN' | 'UNBAN', reason?: string, duration?: number) => {
            return this.request<{ message: string; user: UserProfile }>('/admin', {
                method: 'POST',
                body: JSON.stringify({
                    operationType: 'moderate_user',
                    userId,
                    action,
                    reason,
                    duration,
                }),
            });
        },
    };
}

const api = new ApiClient();

export default api;

export { ApiClient };
