import { prisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true }
  });

  if (!dbUser || !dbUser.username) {
    redirect("/onboarding");
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Hello, {dbUser.username}!</h1>
      {/* going on */}
    </main>
  );
}