import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@vercel/kv";
import { NextResponse } from "next/server";
import { User } from "@/types/user";

const kv = createClient({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await kv.get<User>(`user:${session.user.id}`);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const updatedUser = {
    ...user,
    banned: true,
  };

  await kv.set(`user:${session.user.id}`, JSON.stringify(updatedUser));
  return NextResponse.json({ success: true });
}
