import { getServerSession } from "next-auth/next";

import { options } from "@/pages/api/auth/[...nextauth]";

// Getting the session in Next13 app/ directory
// https://next-auth.js.org/configuration/nextjs#in-app-directory
export async function getSession() {
  return await getServerSession(options);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}
