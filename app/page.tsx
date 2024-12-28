import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import NoUser from "@/components/noUser";
import Navbar from "@/components/Navbar";
import Game from "@/components/Game";
import Footer from "@/components/footer";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <NoUser />;
  }
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <Navbar />
      <Game />
      <Footer />
    </main>
  );
}
