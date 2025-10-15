export type GameScreen = 'menu' | 'game' | 'shop' | 'leaderboard' | 'boss';

export interface PowerUp {
  id: string;
  name: string;
  cost: number;
  level: number;
  maxLevel: number;
  description: string;
}

export interface Obstacle {
  id: number;
  x: number;
  type: 'spike' | 'pit' | 'enemy';
}

export interface BossAttack {
  id: number;
  x: number;
  y: number;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
}
