export function calculateScore(averageTimeInSeconds: number): number | null {
  // If average completion time is less than 5 seconds, return null (indicates cheating)
  if (averageTimeInSeconds < 5) {
    return null;
  }

  // Base score of 15000 (increased from 10000 since it's 3 mazes)
  // The longer it takes on average, the less points you get
  const score = Math.max(0, Math.floor(15000 - averageTimeInSeconds * 100));
  return score;
}

export function formatTime(ms: number): string {
  return (ms / 1000).toFixed(1);
}
