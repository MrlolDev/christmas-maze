import { createClient } from "@vercel/kv";
import { NextResponse } from "next/server";
import { User } from "@/types/user";

const kv = createClient({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
  try {
    // Get all users
    const userKeys = await kv.keys("user:*");
    const users = await Promise.all(
      userKeys.map(async (key) => {
        const user = await kv.get<User>(key);
        return user;
      })
    );

    // Get highest score for each user
    const leaderboardData = users
      .filter((user): user is User => user !== null)
      .map((user) => {
        const highestScore =
          user.scores.length > 0
            ? Math.max(...user.scores.map((s) => s.score))
            : 0;

        return {
          name: user.name,
          image: user.image,
          highestScore,
        };
      })
      .sort((a, b) => b.highestScore - a.highestScore)
      .slice(0, 10); // Top 10 players

    return NextResponse.json(leaderboardData);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
