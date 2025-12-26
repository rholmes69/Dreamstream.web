
import { Tutorial, LeaderboardEntry, SkillMetric } from './types';

export const INITIAL_USER = {
  name: "Alex",
  points: 1500,
  ranking: 42
};

export const MOCK_TUTORIALS: Tutorial[] = [
  { 
    id: 1, 
    title: "Fire Kick Basics", 
    duration: "10m", 
    completed: false, 
    difficulty: 'Beginner',
    thumbnail: 'https://picsum.photos/seed/fire/400/225'
  },
  { 
    id: 2, 
    title: "Particle Effects 101", 
    duration: "15m", 
    completed: true, 
    difficulty: 'Intermediate',
    thumbnail: 'https://picsum.photos/seed/vfx/400/225'
  },
  { 
    id: 3, 
    title: "Ancient Temple Lighting", 
    duration: "25m", 
    completed: false, 
    difficulty: 'Master',
    thumbnail: 'https://picsum.photos/seed/temple/400/225'
  },
  { 
    id: 4, 
    title: "Katana Energy Trail", 
    duration: "12m", 
    completed: false, 
    difficulty: 'Intermediate',
    thumbnail: 'https://picsum.photos/seed/katana/400/225'
  }
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "SenseiVFX", points: 9800, badges: ['🔥', '🥋'] },
  { rank: 2, name: "DragonFan99", points: 8500, badges: ['🐉'] },
  { rank: 3, name: "VFXMaster_Lee", points: 7200, badges: ['✨', '🏆'] },
  { rank: 4, name: "NinjaSlayer", points: 6800, badges: [] },
  { rank: 5, name: "Alex (You)", points: 1500, badges: ['🎖️'] },
];

export const SKILL_METRICS: SkillMetric[] = [
  { subject: 'Power', value: 85, fullMark: 100 },
  { subject: 'VFX', value: 95, fullMark: 100 },
  { subject: 'Agility', value: 70, fullMark: 100 },
  { subject: 'Form', value: 80, fullMark: 100 },
  { subject: 'Spirit', value: 90, fullMark: 100 },
];

export const MASTERS = [
  { id: 1, name: "Grandmaster Oro", role: "Spirit & Form" },
  { id: 2, name: "Master Blaze", role: "VFX & Pyrotechnics" },
  { id: 3, name: "Sifu Gale", role: "Agility & Speed" },
  { id: 4, name: "Sensei Stone", role: "Power & Strength" },
  { id: 5, name: "Elder Cipher", role: "Technical Directing" },
];
