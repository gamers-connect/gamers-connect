// Shared Types for Game Connect Application

export interface User {
    id: number;
    name: string;
    email: string;
    games: string[];
    platforms: string[];
    playstyle: string;
    location: string;
    bio: string;
    discord: string;
    notifications: boolean;
    avatar: string;
  }
  
  export interface Player {
    id: number;
    name: string;
    games: string[];
    platform: string;
    playstyle: string;
    location: string;
    status: 'online' | 'away' | 'offline';
    rating: number;
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
  }
  
  export interface GameSession {
    id: number;
    title: string;
    game: string;
    host: string;
    date: string;
    time: string;
    players: number;
    maxPlayers: number;
  }
  
  // Mock data constants
  export const mockGames = [
    'Valorant', 'Overwatch 2', 'Super Smash Bros', 'League of Legends', 
    'Apex Legends', 'Rocket League', 'Minecraft', 'Among Us'
  ];
  
  export const mockPlatforms = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];
  export const mockPlaystyles = ['Casual', 'Competitive', 'Cooperative'];
  
  export const mockPlayers: Player[] = [
    { id: 1, name: 'Alex Chen', games: ['Valorant', 'Overwatch 2'], platform: 'PC', playstyle: 'Competitive', location: 'UH Mānoa Campus', status: 'online', rating: 4.8 },
    { id: 2, name: 'Sarah Kim', games: ['Super Smash Bros', 'Minecraft'], platform: 'Nintendo Switch', playstyle: 'Casual', location: 'UH Mānoa Campus', status: 'online', rating: 4.9 },
    { id: 3, name: 'Marcus Johnson', games: ['Apex Legends', 'Rocket League'], platform: 'PC', playstyle: 'Competitive', location: 'UH West Oahu', status: 'away', rating: 4.7 },
    { id: 4, name: 'Luna Patel', games: ['League of Legends', 'Valorant'], platform: 'PC', playstyle: 'Competitive', location: 'UH Mānoa Campus', status: 'online', rating: 4.6 }
  ];
  
  export const mockEvents: GameEvent[] = [
    { id: 1, title: 'Valorant Tournament', game: 'Valorant', date: '2025-07-25', time: '18:00', location: 'UH iLab', type: 'Tournament', attendees: 32, maxAttendees: 64 },
    { id: 2, title: 'Smash Bros Meetup', game: 'Super Smash Bros', date: '2025-07-22', time: '19:00', location: 'Campus Center', type: 'Meetup', attendees: 12, maxAttendees: 20 },
    { id: 3, title: 'Minecraft Build Contest', game: 'Minecraft', date: '2025-07-28', time: '15:00', location: 'Online', type: 'Contest', attendees: 8, maxAttendees: 15 },
    { id: 4, title: 'Overwatch 2 Scrimmage', game: 'Overwatch 2', date: '2025-07-24', time: '20:00', location: 'Hamilton Library', type: 'Scrimmage', attendees: 18, maxAttendees: 24 }
  ];
  
  export const mockSessions: GameSession[] = [
    { id: 1, title: 'Ranked Valorant Grind', game: 'Valorant', host: 'Alex Chen', date: '2025-07-20', time: '21:00', players: 3, maxPlayers: 5 },
    { id: 2, title: 'Chill Minecraft Building', game: 'Minecraft', host: 'Sarah Kim', date: '2025-07-21', time: '16:00', players: 2, maxPlayers: 6 }
  ];
  