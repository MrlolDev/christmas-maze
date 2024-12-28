import "next-auth";
import { Score } from "./user";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      scores: Score[];
      banned?: boolean;
    };
  }
}
