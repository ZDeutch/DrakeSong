import React, { useState, useEffect, useCallback } from 'react';
import AudioClip from './components/AudioClip';
import GuessBox from './components/GuessBox';
import { Track, getRandomTrack } from './lib/tracks';
import { isMatch } from './lib/fuzzy';
import { getStreak, incrementStreak, resetStreak } from './lib/storage';

type Difficulty = 'easy' | 'medium' | 'hard';

interface GameResult {
  isCorrect: boolean;
  correctAnswer?: Track;
}

const DIFFICULTY_DURATIONS: Record<Difficulty, number> = {
  easy: 7,
  medium: 3,
  hard: 1,
};

export default function App() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [result, setResult] = useState<GameResult | null>(null);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial streak and track
  useEffect(() => {
    setStreak(getStreak());
    loadNewTrack();
  }, []);

  const loadNewTrack = useCallback(() => {
    try {
      setIsLoading(true);
      const track = getRandomTrack();
      setCurrentTrack(track);
      setResult(null);
    } catch (error) {
      console.error('Failed to load track:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGuess = (guess: string) => {
    if (!currentTrack) return;

    const isCorrect = isMatch(guess, currentTrack.title);
    
    if (isCorrect) {
      incrementStreak();
      setStreak(getStreak());
    } else {
      resetStreak();
      setStreak(0);
    }

    setResult({
      isCorrect,
      correctAnswer: currentTrack,
    });
  };

  const handlePlayAgain = () => {
    loadNewTrack();
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  };

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !result && !isLoading) {
        e.preventDefault();
        // This would trigger audio play/pause, but we'll handle it in AudioClip
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [result, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Guess the Drake Song</h1>
          <p className="text-gray-300 mb-6">Listen to the preview and guess the song title</p>
          
          {/* Streak Counter */}
          <div className="text-lg mb-6">
            🔥 Streak: <span className="font-bold text-yellow-400">{streak}</span>
          </div>

          {/* Difficulty Selector */}
          <div className="flex justify-center space-x-4 mb-8">
            {Object.entries(DIFFICULTY_DURATIONS).map(([diff, duration]) => (
              <label key={diff} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="difficulty"
                  value={diff}
                  checked={difficulty === diff}
                  onChange={() => handleDifficultyChange(diff as Difficulty)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="capitalize">
                  {diff} ({duration}s)
                </span>
              </label>
            ))}
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="container mx-auto px-4 py-8">
        {!result ? (
          <div className="flex flex-col items-center space-y-8">
            {/* Audio Player */}
            {currentTrack && (
              <AudioClip
                previewUrl={currentTrack.preview_url}
                duration={DIFFICULTY_DURATIONS[difficulty]}
              />
            )}

            {/* Guess Input */}
            <GuessBox onGuess={handleGuess} />
            
            {/* Instructions */}
            <div className="text-center text-gray-300 text-sm max-w-md">
              <p>Keyboard shortcuts:</p>
              <p>Space = Play/Pause • Enter = Submit • Esc = Clear</p>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className={`text-6xl ${result.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {result.isCorrect ? '✅' : '❌'}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {result.isCorrect ? 'Correct!' : 'Not quite...'}
              </h2>
              
              {result.correctAnswer && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">{result.correctAnswer.title}</h3>
                    <p className="text-gray-300">
                      {result.correctAnswer.album} ({result.correctAnswer.year})
                    </p>
                  </div>
                  
                  {result.correctAnswer.image && (
                    <img
                      src={result.correctAnswer.image}
                      alt={`${result.correctAnswer.title} album art`}
                      className="w-32 h-32 mx-auto rounded-lg shadow-lg"
                    />
                  )}
                  
                  <div className="space-y-2">
                    <button
                      onClick={handlePlayAgain}
                      className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      Play Again
                    </button>
                    
                    <p className="text-sm text-gray-400">
                      Audio previews from Spotify
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 text-center py-4 text-gray-400 text-sm">
        Audio previews from Spotify
      </footer>
    </div>
  );
}
