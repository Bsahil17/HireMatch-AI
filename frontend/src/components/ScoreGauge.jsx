import React from 'react';

export default function ScoreGauge({ score = 0, size = 130, strokeWidth = 10, label = "Match Score" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  let strokeColor = "#6366f1"; // Indigo
  let badgeColor = "bg-indigo-50 text-indigo-700 border-indigo-200";
  let statusText = "Moderate Match";

  if (score >= 85) {
    strokeColor = "#10b981"; // Emerald
    badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
    statusText = "Strong Match";
  } else if (score >= 70) {
    strokeColor = "#3b82f6"; // Blue
    badgeColor = "bg-blue-50 text-blue-700 border-blue-200";
    statusText = "Good Match";
  } else if (score >= 50) {
    strokeColor = "#f59e0b"; // Amber
    badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
    statusText = "Moderate Match";
  } else {
    strokeColor = "#ef4444"; // Red
    badgeColor = "bg-rose-50 text-rose-700 border-rose-200";
    statusText = "Low Match";
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {score}%
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </span>
        </div>
      </div>
      <div className={`mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}`}>
        {statusText}
      </div>
    </div>
  );
}
