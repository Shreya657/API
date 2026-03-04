import { prisma } from "@/utils/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const checkUser = async () => {
  const user = await currentUser();

  //  ff no user is logged in, return null
  if (!user) {
    return null;
  }

  // 2.  if the user is already in  DB
  const loggedInUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  //  they are in the DB, return that user
  if (loggedInUser) {
    return loggedInUser;
  }

  //  if not, create a new user in  DB
  const newUser = await prisma.user.create({
    data: {
      id: user.id,
      name: `${user.firstName || "Unknown"} ${user.lastName || "User"}`,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newUser;
};