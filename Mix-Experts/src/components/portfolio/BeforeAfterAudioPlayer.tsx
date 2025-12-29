'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BeforeAfterAudioPlayerProps {
  beforeUrl: string;
  afterUrl: string;
  title?: string;
}

export function BeforeAfterAudioPlayer({ beforeUrl, afterUrl, title }: BeforeAfterAudioPlayerProps) {
  const beforeAudioRef = useRef<HTMLAudioElement>(null);
  const afterAudioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeTrack, setActiveTrack] = useState<'before' | 'after'>('before');

  useEffect(() => {
    const before = beforeAudioRef.current;
    const after = afterAudioRef.current;

    if (!before || !after) return;

    const handleTimeUpdate = () => {
      const current = activeTrack === 'before' ? before : after;
      setCurrentTime(current.currentTime);
    };

    const handleLoadedMetadata = () => {
      const current = activeTrack === 'before' ? before : after;
      setDuration(current.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    before.addEventListener('timeupdate', handleTimeUpdate);
    after.addEventListener('timeupdate', handleTimeUpdate);
    before.addEventListener('loadedmetadata', handleLoadedMetadata);
    after.addEventListener('loadedmetadata', handleLoadedMetadata);
    before.addEventListener('ended', handleEnded);
    after.addEventListener('ended', handleEnded);

    return () => {
      before.removeEventListener('timeupdate', handleTimeUpdate);
      after.removeEventListener('timeupdate', handleTimeUpdate);
      before.removeEventListener('loadedmetadata', handleLoadedMetadata);
      after.removeEventListener('loadedmetadata', handleLoadedMetadata);
      before.removeEventListener('ended', handleEnded);
      after.removeEventListener('ended', handleEnded);
    };
  }, [activeTrack]);

  const togglePlay = () => {
    const before = beforeAudioRef.current;
    const after = afterAudioRef.current;
    if (!before || !after) return;

    if (isPlaying) {
      before.pause();
      after.pause();
    } else {
      if (activeTrack === 'before') {
        before.play();
      } else {
        after.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const switchTrack = (track: 'before' | 'after') => {
    const before = beforeAudioRef.current;
    const after = afterAudioRef.current;
    if (!before || !after) return;

    const wasPlaying = isPlaying;
    const currentTimeStamp = activeTrack === 'before' ? before.currentTime : after.currentTime;

    // Pause both
    before.pause();
    after.pause();

    // Set new active track
    setActiveTrack(track);

    // Sync time
    if (track === 'before') {
      before.currentTime = currentTimeStamp;
      if (wasPlaying) {
        before.play();
      }
    } else {
      after.currentTime = currentTimeStamp;
      if (wasPlaying) {
        after.play();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const before = beforeAudioRef.current;
    const after = afterAudioRef.current;
    if (!before || !after) return;

    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);

    if (activeTrack === 'before') {
      before.currentTime = newTime;
    } else {
      after.currentTime = newTime;
    }
  };

  const reset = () => {
    const before = beforeAudioRef.current;
    const after = afterAudioRef.current;
    if (!before || !after) return;

    before.pause();
    after.pause();
    before.currentTime = 0;
    after.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6 space-y-4">
      <audio ref={beforeAudioRef} src={beforeUrl} preload="metadata" />
      <audio ref={afterAudioRef} src={afterUrl} preload="metadata" />

      {title && (
        <h4 className="text-white font-bold text-center mb-4">{title}</h4>
      )}

      {/* Track Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => switchTrack('before')}
          className={cn(
            'flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all',
            activeTrack === 'before'
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
              : 'bg-[var(--bg-card)] text-[var(--text-gray)] hover:bg-[var(--bg-hover)]'
          )}
        >
          Before (Rough Mix)
        </button>
        <button
          onClick={() => switchTrack('after')}
          className={cn(
            'flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all',
            activeTrack === 'after'
              ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
              : 'bg-[var(--bg-card)] text-[var(--text-gray)] hover:bg-[var(--bg-hover)]'
          )}
        >
          After (Final Master)
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-[var(--bg-card)] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent)] [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={reset}
          className="p-3 text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-card)] rounded-full transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={togglePlay}
          className="p-4 bg-[var(--accent)] text-white rounded-full hover:bg-[var(--accent-light)] transition-all shadow-lg shadow-purple-500/20"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}
