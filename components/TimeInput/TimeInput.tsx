'use client';

import { useState, useEffect } from 'react';

export interface TimeInputProps {
  value?: number; // Total seconds (supports decimals)
  onChange: (seconds: number) => void;
  className?: string;
  disabled?: boolean;
}

/**
 * TimeInput Component
 * 
 * Allows users to input time as hours, minutes, and seconds (with decimal support).
 * Stores and returns total seconds.
 */
export function TimeInput({ value = 0, onChange, className = '', disabled = false }: TimeInputProps) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState('0');

  // Convert total seconds to h/m/s on value change
  useEffect(() => {
    const h = Math.floor(value / 3600);
    const m = Math.floor((value % 3600) / 60);
    const s = value % 60;
    setHours(h);
    setMinutes(m);
    setSeconds(s.toFixed(1));
  }, [value]);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = Math.max(0, parseInt(e.target.value) || 0);
    setHours(newHours);
    onChange(newHours * 3600 + minutes * 60 + parseFloat(seconds));
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
    setMinutes(newMinutes);
    onChange(hours * 3600 + newMinutes * 60 + parseFloat(seconds));
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const parsed = parseFloat(input);
    const newSeconds = Math.max(0, Math.min(59.9, isNaN(parsed) ? 0 : parsed));
    setSeconds(input); // Keep raw input for better UX
    onChange(hours * 3600 + minutes * 60 + newSeconds);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min="0"
          value={hours}
          onChange={handleHoursChange}
          disabled={disabled}
          className="w-16 px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe2c55] focus:border-transparent transition-all disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed text-gray-900 dark:text-white"
          aria-label="Hours"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">h</span>
      </div>
      <span className="text-gray-400 dark:text-gray-500">:</span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min="0"
          max="59"
          value={minutes}
          onChange={handleMinutesChange}
          disabled={disabled}
          className="w-16 px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe2c55] focus:border-transparent transition-all disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed text-gray-900 dark:text-white"
          aria-label="Minutes"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">m</span>
      </div>
      <span className="text-gray-400 dark:text-gray-500">:</span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min="0"
          max="59.9"
          step="0.1"
          value={seconds}
          onChange={handleSecondsChange}
          disabled={disabled}
          className="w-16 px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe2c55] focus:border-transparent transition-all disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed text-gray-900 dark:text-white"
          aria-label="Seconds"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">s</span>
      </div>
    </div>
  );
}
