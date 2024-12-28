"use client";

import { signIn } from "next-auth/react";
import Button from "./Button";

export default function NoUser() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-[#8c191f]">
        You are not logged in
      </h1>
      <Button onClick={() => signIn("github")}>Sign In</Button>
    </div>
  );
}
