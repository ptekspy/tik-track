'use client';

import { useState, useEffect } from 'react';

export interface PercentageInputProps {
  value?: number; // Decimal (0-1)
  onChange: (decimal: number) => void;
  className?: string;
  disabled?: boolean;
  min?: number; // Minimum percentage (default 0)
  max?: number; // Maximum percentage (default 100)
}

/**
 * PercentageInput Component
 * 
 * Displays and edits percentages (0-100%) but stores as decimal (0-1).
 * Example: Display "10.55%" for value 0.1055
 */
export function PercentageInput({ 
  value = 0, 
  onChange, 
  className = '', 
  disabled = false,
  min = 0,
  max = 100,
}: PercentageInputProps) {
  const [displayValue, setDisplayValue] = useState('0');

  // Convert decimal to percentage for display
  useEffect(() => {
    const percentage = (value * 100).toFixed(2);
    setDisplayValue(percentage);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);
  };

  const handleBlur = () => {
    let percentage = parseFloat(displayValue) || 0;
    
    // Clamp to min/max
    percentage = Math.max(min, Math.min(max, percentage));
    
    // Convert to decimal
    const decimal = percentage / 100;
    
    // Update display with formatted value
    setDisplayValue(percentage.toFixed(2));
    
    // Call onChange with decimal value
    onChange(decimal);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <input
        type="number"
        step="0.01"
        min={min}
        max={max}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="w-28 px-3 py-2 pr-8 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe2c55] focus:border-transparent transition-all disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed text-gray-900 dark:text-white"
        aria-label="Percentage"
      />
      <span className="absolute right-3 text-sm text-gray-500 dark:text-gray-400 pointer-events-none font-medium">%</span>
    </div>
  );
}
