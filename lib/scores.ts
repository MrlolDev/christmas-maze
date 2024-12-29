import { createClient } from "@vercel/kv";
import { User, Score } from "../types/user";

const kv = createClient({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function addScore(
  userId: string,
  score: { totalScore: number; mazeScores: number[] }
) {
  const user = await kv.get<User>(`user:${userId}`);
  if (!user) return null;

  const newScore: Score = {
    id: crypto.randomUUID(),
    score,
    created_at: new Date(),
    newScoreSystem: true,
    isTopScore:
      user.scores.length === 0 ||
      score.totalScore >
        Math.max(
          ...user.scores
            .filter((s) => s.newScoreSystem)
            .map((s) => s.score.totalScore)
        ),
  };

  const updatedUser = {
    ...user,
    scores: [...user.scores, newScore],
  };

  await kv.set(`user:${userId}`, JSON.stringify(updatedUser));
  return newScore;
}

export async function getUserScores(userId: string) {
  console.log(userId);
  const user = await kv.get<User>(`user:${userId}`);
  if (!user) return null;
  return user.scores;
}

export async function getTopScores() {
  const scores = await kv.keys("score:*");
  return scores;
}
