
import React, { useState, useEffect } from 'react';
import { AppState, UserProfile, Unit } from './types';
import { INITIAL_UNITS } from './constants';
import { Onboarding } from './views/Onboarding';
import { Dashboard } from './views/Dashboard';
import { LessonView } from './views/LessonView';
import { ChatView } from './views/ChatView';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('speakflow_state');
    if (saved) return JSON.parse(saved);
    return {
      user: {
        name: '',
        hasStudiedBefore: 'never',
        goal: 'daily',
        level: 'Getting Started' as any,
        xp: 0,
        streak: 0,
        dailyGoalMinutes: 10,
        onboarded: false
      },
      units: INITIAL_UNITS,
      currentSession: null
    };
  });

  const [currentView, setCurrentView] = useState<'onboarding' | 'dashboard' | 'lesson' | 'chat'>('onboarding');
  const [activeUnit, setActiveUnit] = useState<Unit | null>(null);

  useEffect(() => {
    localStorage.setItem('speakflow_state', JSON.stringify(state));
    if (state.user.onboarded && currentView === 'onboarding') {
      setCurrentView('dashboard');
    }
  }, [state, currentView]);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setState(prev => ({ ...prev, user: profile }));
    setCurrentView('dashboard');
  };

  const startLesson = (unit: Unit) => {
    setActiveUnit(unit);
    setCurrentView('lesson');
  };

  const startChat = (unit: Unit) => {
    setActiveUnit(unit);
    setCurrentView('chat');
  };

  const handleSessionComplete = (xpGained: number) => {
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        xp: prev.user.xp + xpGained,
        streak: prev.user.streak === 0 ? 1 : prev.user.streak
      }
    }));
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative shadow-xl overflow-hidden flex flex-col">
      {currentView === 'onboarding' && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      
      {currentView === 'dashboard' && (
        <Dashboard 
          user={state.user} 
          units={state.units} 
          onStartLesson={startLesson} 
          onStartChat={startChat}
        />
      )}

      {currentView === 'lesson' && activeUnit && (
        <LessonView 
          unit={activeUnit} 
          onComplete={handleSessionComplete}
          onBack={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'chat' && activeUnit && (
        <ChatView 
          unit={activeUnit} 
          onBack={() => setCurrentView('dashboard')}
        />
      )}
    </div>
  );
};

export default App;
