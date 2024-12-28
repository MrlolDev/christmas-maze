"use client";

import { Score } from "@/types/user";
import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      if (!session?.user?.id) return;
      const scores = await fetch("/api/scores");
      const data = await scores.json();
      setScores(data || []);
    };
    fetchScores();
  }, [session?.user?.id]);

  return (
    <nav className="flex flex-row items-center justify-between absolute top-[23vh] left-[50vw] translate-x-[-50%] h-16 bg-red-500 w-[25vw] rounded-full nav py-4 px-2">
      <div className="flex items-center">
        <Image
          src={session?.user?.image || "/default-profile.png"}
          alt="Profile Picture"
          width={40}
          height={40}
          className="rounded-full mr-2"
        />
        <span className="text-white font-semibold">{session?.user?.name}</span>
      </div>
      <Link
        href="/leaderboard"
        className="text-white font-semibold hover:text-gray-200"
      >
        Leaderboard
      </Link>

      <span
        className="text-white font-semibold transition-all duration-300 p-2 rounded-full button2"
        onClick={() => signOut()}
      >
        Your Top Score:{" "}
        {scores.length > 0 ? Math.max(...scores.map((s) => s.score)) : 0}
      </span>
    </nav>
  );
}
