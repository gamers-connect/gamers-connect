export interface Player {
    id: string;
    name: string;
    games: string[];
    platform: string;
    playstyle: string;
    location: string;
    status: 'online' | 'away' | 'offline';
    rating: number;
    bio?: string;
    discord?: string;
  }
  
  export interface GameEvent {
    id: number;
    title: string;
    game: string;
    date: string;
    time: string;
    location: string;
    type: 'Tournament' | 'Meetup' | 'Contest' | 'Scrimmage';
    attendees: number;
    maxAttendees: number;
    description?: string;
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
    date: Date;
    time: string;
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    hostId: string;
    host: {
      id: string;
      name: string;
      avatar?: string;
    };
    members: Array<{
      id: string;
      user: {
        id: string;
        name: string;
        avatar?: string;
        status: string;
      };
    }>;
    memberCount: number;
    isFull: boolean;
    spotsLeft: number;
  }
  