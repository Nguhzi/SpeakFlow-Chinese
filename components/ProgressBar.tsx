
import React from 'react';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: string;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  color = 'bg-teal-500', 
  height = 'h-2', 
  label 
}) => {
  return (
    <div className="w-full">
      {label && <div className="flex justify-between mb-1 text-xs font-medium text-gray-600">
        <span>{label}</span>
        <span>{Math.round(progress)}%</span>
      </div>}
      <div className={`w-full bg-gray-200 rounded-full ${height} overflow-hidden`}>
        <div 
          className={`${color} h-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};
