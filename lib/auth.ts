import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { createClient } from "@vercel/kv";
import { User } from "../types/user";

const kv = createClient({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const existingUser = await kv.get<User>(`user:${user.id}`);

      if (!existingUser) {
        const newUser: User = {
          id: user.id,
          name: user.name || "",
          email: user.email,
          image: user.image || "",
          scores: [],
        };

        await kv.set(`user:${user.id}`, JSON.stringify(newUser));
      }

      return true;
    },
    async session({ session, token }) {
      if (token.sub) {
        const user = await kv.get<User>(`user:${token.sub}`);
        if (user) {
          session.user = {
            ...session.user,
            id: token.sub,
            scores: user.scores,
            banned: user.banned,
          };
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};
