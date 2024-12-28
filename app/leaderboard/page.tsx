"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type LeaderboardEntry = {
  name: string;
  image: string;
  highestScore: number;
};

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/leaderboard");
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center pt-32 justify-center">
      <h1 className="text-4xl font-bold text-red-800 mb-8">Leaderboard</h1>

      {loading ? (
        <div className="text-xl text-red-800">Loading...</div>
      ) : (
        <div className="w-[600px] bg-red-500 rounded-lg nav p-6 max-h-[54vh] overflow-y-auto">
          <div className="space-y-4">
            {leaderboard.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-red-600/50 rounded-lg p-4"
              >
                <div className="flex items-center gap-4">
                  <span className="text-white font-bold text-xl w-8">
                    #{index + 1}
                  </span>
                  <img
                    src={entry.image || "/default-profile.png"}
                    alt={`${entry.name}'s avatar`}
                    className="w-10 h-10 rounded-full"
                  />
                  <Link
                    href={`https://github.com/${entry.name}`}
                    className="text-white font-semibold hover:text-white/50 underline transition-all duration-300"
                  >
                    {entry.name}
                  </Link>
                </div>
                <span className="text-white font-bold">
                  {entry.highestScore} points
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Link href="/" className="button mt-8">
        Back to Game
      </Link>
    </div>
  );
}
