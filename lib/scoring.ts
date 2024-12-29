interface MazeAttempt {
  timeInSeconds: number;
  steps: number;
}

export function calculateScore(mazeAttempts: MazeAttempt[]): {
  totalScore: number;
  mazeScores: number[];
} {
  // Calculate score for each maze attempt
  const mazeScores = mazeAttempts.map((attempt) => {
    // Calculate efficiency ratio (steps vs time)
    const efficiency = attempt.steps / attempt.timeInSeconds;

    // Base score calculation
    const baseScore = Math.max(
      0,
      Math.floor(5000 - attempt.timeInSeconds * 50)
    );

    // Adjust score based on path efficiency
    // If efficiency is too high (very few steps for the time), reduce score
    // If efficiency is balanced, maintain or boost score
    let efficiencyMultiplier = 1;
    if (efficiency < 0.5) {
      // Very slow movement, reduce score
      efficiencyMultiplier = 0.7;
    } else if (efficiency > 2) {
      // Suspiciously efficient, reduce score
      efficiencyMultiplier = 0.8;
    } else {
      // Good balance between speed and path length
      efficiencyMultiplier = 1.2;
    }

    // Apply length factor - shorter paths should yield lower max scores
    const lengthFactor = Math.min(1, attempt.steps / 20); // Normalize against expected minimum path of 20 steps

    return Math.floor(baseScore * efficiencyMultiplier * lengthFactor);
  });

  // Sum up all maze scores
  const totalScore = mazeScores.reduce((sum, score) => sum + score, 0);

  return { totalScore, mazeScores };
}

export function formatTime(ms: number): string {
  return (ms / 1000).toFixed(1);
}
