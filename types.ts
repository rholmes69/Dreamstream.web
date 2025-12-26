
export type Theme = 'light' | 'dark' | 'system';
export type Tab = 'dashboard' | 'arena' | 'dojo' | 'leaderboard' | 'membership';

export interface User {
  name: string;
  points: number;
  ranking: number;
  subscription?: 'free' | 'elite' | 'master';
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  badges: string[];
}

export interface Tutorial {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Master';
  thumbnail: string;
}

export interface SkillMetric {
  subject: string;
  value: number;
  fullMark: number;
}

export interface AppState {
  currentPage: Tab;
  theme: Theme;
  user: User;
  leaderboard: LeaderboardEntry[];
  tutorials: Tutorial[];
  sidebarOpen: boolean;
}
