import React, { useRef, useState, useEffect } from 'react';

interface AudioClipProps {
  previewUrl: string;
  duration: number; // Duration in seconds (1, 3, or 7)
  onPlay?: () => void;
  onPause?: () => void;
}

export default function AudioClip({ previewUrl, duration, onPlay, onPause }: AudioClipProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      
      // Auto-pause at the specified duration
      if (audio.currentTime >= duration) {
        audio.pause();
        setIsPlaying(false);
        onPause?.();
      }
    };

    const handleLoadedData = () => {
      setIsLoaded(true);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onPause?.();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [duration, onPause]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      onPause?.();
    } else {
      // Always restart from the beginning
      audio.currentTime = 0;
      audio.play();
      setIsPlaying(true);
      onPlay?.();
    }
  };

  const progress = (currentTime / duration) * 100;

  return (
    <div className="flex flex-col items-center space-y-4">
      <audio
        ref={audioRef}
        src={previewUrl}
        preload="metadata"
        muted
      />
      
      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        disabled={!isLoaded}
        className={`
          w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl
          transition-all duration-200 transform hover:scale-105
          ${isLoaded 
            ? (isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600')
            : 'bg-gray-400 cursor-not-allowed'
          }
        `}
      >
        {isPlaying ? '⏸️' : '▶️'}
      </button>

      {/* Progress Bar */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Duration Info */}
      <div className="text-sm text-gray-600">
        {Math.round(currentTime * 10) / 10}s / {duration}s
      </div>
    </div>
  );
}
