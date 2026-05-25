/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MoodType = 'heart' | 'sprout' | 'sun' | 'zzz';

export interface User {
  id: string;
  username: string;
  avatar_url: string;
  email?: string;
  created_at?: string;
}

export interface Reaction {
  id: string;
  tile_id: string;
  user_id: string;
  username: string;
  emoji: '❤️' | '🌱' | '☀️' | '💤';
}

export interface Tile {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string;
  date: string; // ISO format "YYYY-MM-DD"
  image_url: string;
  caption: string;
  mood: MoodType;
  created_at: string;
  reactions: Reaction[];
}

export interface Friend {
  id: string;
  username: string;
  avatar_url: string;
  status: 'friends' | 'pending' | 'requested';
}

export type ScreenState = 'onboarding' | 'gallery' | 'journal' | 'circle' | 'self';
