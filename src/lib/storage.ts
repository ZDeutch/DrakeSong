const STREAK_KEY = 'drake-song-streak';

export function getStreak(): number {
  try {
    const streak = localStorage.getItem(STREAK_KEY);
    return streak ? parseInt(streak, 10) : 0;
  } catch {
    return 0;
  }
}

export function setStreak(streak: number): void {
  try {
    localStorage.setItem(STREAK_KEY, streak.toString());
  } catch {
    // Silently fail if localStorage is not available
  }
}

export function incrementStreak(): void {
  const current = getStreak();
  setStreak(current + 1);
}

export function resetStreak(): void {
  setStreak(0);
}
