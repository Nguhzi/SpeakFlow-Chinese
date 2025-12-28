
import React from 'react';
import { UserProfile, Unit } from '../types';
import { ProgressBar } from '../components/ProgressBar';
import { Flame, Star, BookOpen, MessageCircle, Lock } from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  units: Unit[];
  onStartLesson: (unit: Unit) => void;
  onStartChat: (unit: Unit) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, units, onStartLesson, onStartChat }) => {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
      {/* Header */}
      <div className="bg-white p-6 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Hi, {user.name}!</h1>
            <p className="text-sm text-gray-500">{user.level}</p>
          </div>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-1 bg-orange-50 px-3 py-1 rounded-full text-orange-600 font-bold">
              <Flame size={18} />
              <span>{user.streak}</span>
            </div>
            <div className="flex items-center space-x-1 bg-teal-50 px-3 py-1 rounded-full text-teal-600 font-bold">
              <Star size={18} />
              <span>{user.xp}</span>
            </div>
          </div>
        </div>
        <ProgressBar progress={45} label="Today's Goal" />
      </div>

      {/* Unit List */}
      <div className="p-6 space-y-6">
        {units.map((unit, idx) => (
          <div 
            key={unit.id}
            className={`bg-white rounded-3xl p-5 shadow-sm border border-gray-100 transition-all ${
              unit.isLocked ? 'opacity-70 grayscale' : 'hover:shadow-md'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Unit {idx + 1}</span>
                <h3 className="text-lg font-bold text-gray-900 leading-tight mt-1">{unit.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{unit.outcome}</p>
              </div>
              {unit.isLocked && <Lock className="text-gray-400" size={20} />}
            </div>
            
            <div className="mb-6">
              <ProgressBar progress={unit.progress} color="bg-teal-500" height="h-1.5" />
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={() => !unit.isLocked && onStartLesson(unit)}
                disabled={unit.isLocked}
                className="flex-1 bg-teal-600 text-white font-bold py-3 rounded-2xl flex items-center justify-center space-x-2 active:scale-95 transition-all"
              >
                <BookOpen size={18} />
                <span>Practice</span>
              </button>
              <button 
                onClick={() => !unit.isLocked && onStartChat(unit)}
                disabled={unit.isLocked}
                className="w-14 h-14 bg-amber-100 text-amber-700 font-bold rounded-2xl flex items-center justify-center active:scale-95 transition-all"
              >
                <MessageCircle size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
