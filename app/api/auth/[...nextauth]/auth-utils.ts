import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getSession } from "next-auth/react";
import authOptions from "./authOptions";

export async function loginIsRequiredServer() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/api/auth/signin");
}

export async function loginIsRequiredClient() {
  if (typeof window !== "undefined") {
    const session = await getSession();
    if (!session) {
      window.location.href = "/api/auth/signin";
    }
  }
}