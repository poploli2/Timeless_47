export interface Memory {
  id: string;
  title: string;
  content: string;
  date: string; // ISO date string YYYY-MM-DD
  imageUrl?: string;
  location?: string;
  mood: Mood;
}

export interface Milestone {
  id: string;
  title: string;
  date: string; // MM-DD (Year is ignored for annual recurrence usually, but we store YYYY-MM-DD for reference)
  type: 'Anniversary' | 'Birthday' | 'Special';
}

export enum Mood {
  HAPPY = 'Happy',
  ROMANTIC = 'Romantic',
  ADVENTUROUS = 'Adventurous',
  COZY = 'Cozy',
  SILLY = 'Silly',
  GRATEFUL = 'Grateful'
}

export enum AppView {
  TIMELINE = 'TIMELINE',
  ADD_MEMORY = 'ADD_MEMORY',
  AI_TOOLS = 'AI_TOOLS',
  PROFILE = 'PROFILE',
  LOGIN = 'LOGIN'
}

export interface DateIdeaParams {
  weather: string;
  budget: string;
  vibe: string;
}

export interface LoveLetterParams {
  tone: string;
  context: string; // e.g., anniversary, apology, just because
  length: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  myAnswer?: string;
  partnerAnswer?: string;
  isRevealed: boolean;
}