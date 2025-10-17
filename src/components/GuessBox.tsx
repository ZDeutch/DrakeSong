import React, { useState, useRef, useEffect } from 'react';
import { getAllTrackTitles } from '../lib/tracks';
import { normalizeTitle } from '../lib/fuzzy';

interface GuessBoxProps {
  onGuess: (guess: string) => void;
  disabled?: boolean;
}

export default function GuessBox({ onGuess, disabled = false }: GuessBoxProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const allTitles = getAllTrackTitles();

  // Filter suggestions based on input
  useEffect(() => {
    if (!input.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const normalizedInput = normalizeTitle(input);
    const filtered = allTitles
      .filter(title => 
        normalizeTitle(title).includes(normalizedInput) ||
        title.toLowerCase().includes(input.toLowerCase())
      )
      .slice(0, 6); // Show top 6 suggestions

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setSelectedIndex(-1);
  }, [input, allTitles]);

  const handleSubmit = () => {
    const guess = selectedIndex >= 0 && selectedIndex < suggestions.length
      ? suggestions[selectedIndex]
      : input.trim();
    
    if (guess) {
      onGuess(guess);
      setInput('');
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        handleSubmit();
        break;
      
      case 'Escape':
        e.preventDefault();
        setInput('');
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      
      case 'ArrowDown':
        e.preventDefault();
        if (showSuggestions) {
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        if (showSuggestions) {
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
        }
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="flex space-x-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
          onBlur={() => {
            // Delay hiding suggestions to allow clicks
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          placeholder="Guess the song title..."
          disabled={disabled}
          className={`
            flex-1 px-4 py-3 border-2 rounded-lg text-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500
            transition-all duration-200
            ${disabled 
              ? 'bg-gray-100 border-gray-300 cursor-not-allowed' 
              : 'border-gray-300 focus:border-blue-500'
            }
          `}
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          className={`
            px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold
            transition-all duration-200 transform hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${disabled || !input.trim()
              ? 'bg-gray-400 cursor-not-allowed transform-none'
              : 'hover:bg-blue-600'
            }
          `}
        >
          Submit
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`
                w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors
                ${index === selectedIndex ? 'bg-blue-100' : ''}
              `}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
