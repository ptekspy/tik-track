'use client';

import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

export interface HashtagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  maxTags?: number;
}

/**
 * HashtagInput Component
 * 
 * Chip-based hashtag input with add/remove functionality.
 * Automatically enforces lowercase and trimming.
 */
export function HashtagInput({ 
  value = [], 
  onChange, 
  className = '', 
  disabled = false,
  placeholder = 'Add hashtag...',
  maxTags,
}: HashtagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const normalizeTag = (tag: string): string => {
    return tag.toLowerCase().trim().replace(/^#/, ''); // Remove leading # if present
  };

  const addTags = (input: string) => {
    // Split on spaces, newlines, commas to support pasting multiple hashtags
    const tags = input.split(/[\s,\n]+/).filter(t => t.trim());
    
    const newTags: string[] = [];
    for (const tag of tags) {
      const normalized = normalizeTag(tag);
      if (!normalized) continue;
      if (value.includes(normalized)) continue;
      if (newTags.includes(normalized)) continue; // Avoid duplicates in batch
      if (maxTags && value.length + newTags.length >= maxTags) break;
      
      newTags.push(normalized);
    }

    if (newTags.length > 0) {
      onChange([...value, ...newTags]);
      setInputValue('');
    }
  };

  const addTag = (tag: string) => {
    const normalized = normalizeTag(tag);
    
    if (!normalized) return;
    if (value.includes(normalized)) return;
    if (maxTags && value.length >= maxTags) return;

    onChange([...value, normalized]);
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Check if input contains multiple hashtags (spaces)
      if (inputValue.includes(' ') || inputValue.includes(',')) {
        addTags(inputValue);
      } else {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove last tag on backspace if input is empty
      removeTag(value[value.length - 1]);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      // Check if input contains multiple hashtags (spaces)
      if (inputValue.includes(' ') || inputValue.includes(',')) {
        addTags(inputValue);
      } else {
        addTag(inputValue);
      }
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded min-h-[42px] focus-within:ring-2 focus-within:ring-blue-500">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
          >
            #{tag}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] outline-none bg-transparent disabled:cursor-not-allowed text-sm"
          aria-label="Hashtag input"
        />
      </div>
      {maxTags && (
        <p className="mt-1 text-xs text-gray-500">
          {value.length} / {maxTags} tags
        </p>
      )}
    </div>
  );
}
