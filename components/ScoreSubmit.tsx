"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Input from "./Input";
import Button from "./Button";

export default function ScoreSubmit() {
  const [score, setScore] = useState(0);
  const { data: session } = useSession();

  const submitScore = async (score: number) => {
    if (!session?.user?.id) return;

    const response = await fetch("/api/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score }),
    });

    if (response.ok) {
      // Handle success
    }
  };

  return (
    <div>
      <Input
        type="number"
        placeholder="Enter your score"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setScore(Number(e.target.value))
        }
        min={0}
      />
      <Button onClick={() => submitScore(score)}>Submit Score</Button>
    </div>
  );
}
