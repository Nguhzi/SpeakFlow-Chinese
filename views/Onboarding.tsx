
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { EXPERIENCE_OPTIONS, GOAL_OPTIONS } from '../constants';
import { UserLevel, UserProfile } from '../types';
import { Rocket, GraduationCap, Target, ChevronRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    hasStudiedBefore: 'never',
    goal: 'daily',
    xp: 0,
    streak: 1,
    dailyGoalMinutes: 10,
    level: UserLevel.BEGINNER,
    onboarded: true
  });

  const nextStep = () => setStep(s => s + 1);

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="flex flex-col items-center text-center space-y-8 p-6 animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
              <Rocket size={48} />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Welcome to SpeakFlow!</h1>
              <p className="text-gray-500">Let's build your personalized path to fluency in Mandarin.</p>
            </div>
            <div className="w-full space-y-4">
               <input 
                type="text" 
                placeholder="What should we call you?" 
                className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-teal-500 outline-none transition-all text-lg"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
              />
              <Button size="xl" disabled={!profile.name} onClick={nextStep}>
                Get Started <ChevronRight className="ml-2" />
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center text-center space-y-6 p-6">
            <GraduationCap className="text-teal-600 mb-2" size={40} />
            <h2 className="text-2xl font-bold">Have you studied Chinese before?</h2>
            <div className="w-full space-y-3">
              {EXPERIENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setProfile({ ...profile, hasStudiedBefore: opt.id as any });
                    nextStep();
                  }}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                    profile.hasStudiedBefore === opt.id ? 'border-teal-500 bg-teal-50' : 'border-gray-100'
                  }`}
                >
                  <div className="font-bold text-gray-900">{opt.label}</div>
                  <div className="text-sm text-gray-500">{opt.description}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center text-center space-y-6 p-6">
            <Target className="text-teal-600 mb-2" size={40} />
            <h2 className="text-2xl font-bold">What's your main goal?</h2>
            <div className="grid grid-cols-2 gap-3 w-full">
              {GOAL_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setProfile({ ...profile, goal: opt.id as any });
                    nextStep();
                  }}
                  className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center space-y-2 ${
                    profile.goal === opt.id ? 'border-teal-500 bg-teal-50' : 'border-gray-100'
                  }`}
                >
                  <span className="text-3xl">{opt.icon}</span>
                  <div className="font-bold text-sm text-gray-900 leading-tight">{opt.label}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center text-center space-y-8 p-6">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
              <span className="text-4xl font-bold">🎉</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Ready to go, {profile.name}!</h2>
              <p className="text-gray-500">We've tailored Unit 1 to get you speaking immediately. Your journey starts now.</p>
            </div>
            <Button size="xl" onClick={() => onComplete(profile as UserProfile)}>
              Start Learning
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center bg-white">
      {renderStep()}
    </div>
  );
};
