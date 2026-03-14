"use server";

import { prisma } from "@/utils/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function completeOnboarding(username: string) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user)
     throw new Error("Unauthorized");

  // 1. check if the username is already taken
  const existing = await prisma.user.findUnique({
    where: { username }
  });
  
 // if someone else owns it and its not that user, throw errror
  if (existing && existing.id !== userId) {
    throw new Error("Username already taken. Try another one!");
  }

  // 2. Update the user 
  await prisma.user.upsert({ //update+ insert
    where: { id: userId },
    update: { username },
    create: {
      id: userId,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      username,
    },
  });

  // 3. Send them to the main content
  redirect("/dashboard");
}


