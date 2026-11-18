import React from 'react';

export default function SkillOverlapBar({ skillName, percentage = 85, isRequired = true, isMatched = true }) {
  return (
    <div className="mb-2.5">
      <div className="flex justify-between items-center text-xs mb-1">
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className={`w-1.5 h-1.5 rounded-full ${isMatched ? 'bg-emerald-500' : 'bg-rose-400'}`}></span>
          <span>{skillName}</span>
          {isRequired ? (
            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-normal">Required</span>
          ) : (
            <span className="text-[10px] bg-indigo-50 text-indigo-500 px-1.5 py-0.2 rounded font-normal">Bonus</span>
          )}
        </div>
        <span className={`font-semibold ${isMatched ? 'text-slate-800' : 'text-slate-400'}`}>
          {isMatched ? `${percentage}%` : 'Missing'}
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-700 ${
            !isMatched
              ? 'bg-slate-200 w-0'
              : percentage >= 85
              ? 'bg-indigo-600'
              : percentage >= 70
              ? 'bg-blue-500'
              : 'bg-amber-500'
          }`}
          style={{ width: isMatched ? `${percentage}%` : '0%' }}
        />
      </div>
    </div>
  );
}
