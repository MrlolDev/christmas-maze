import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addScore, getUserScores } from "@/lib/scores";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { score } = await request.json();

  const newScore = await addScore(session.user.id, score);

  if (!newScore) {
    return NextResponse.json({ error: "Failed to add score" }, { status: 400 });
  }

  return NextResponse.json(newScore);
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const scores = await getUserScores(session.user.id);
  return NextResponse.json(scores);
}
