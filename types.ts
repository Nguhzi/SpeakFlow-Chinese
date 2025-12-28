
export enum UserLevel {
  BEGINNER = 'Getting Started',
  INTERMEDIATE = 'Getting Conversational',
  ADVANCED = 'Fluent Explorer'
}

export interface UserProfile {
  name: string;
  hasStudiedBefore: 'never' | 'little' | 'consistently';
  goal: 'daily' | 'travel' | 'work' | 'exploring';
  level: UserLevel;
  xp: number;
  streak: number;
  dailyGoalMinutes: number;
  onboarded: boolean;
}

export interface LessonItem {
  id: string;
  chinese: string;
  pinyin: string;
  english: string;
  type: 'word' | 'phrase' | 'sentence';
  audioUrl?: string; // Optional if we use TTS
}

export interface Unit {
  id: string;
  title: string;
  outcome: string;
  items: LessonItem[];
  isLocked: boolean;
  progress: number; // 0 to 100
  level: UserLevel;
}

export interface AppState {
  user: UserProfile;
  units: Unit[];
  currentSession: {
    unitId: string | null;
    step: number;
    totalSteps: number;
    isReview: boolean;
  } | null;
}
