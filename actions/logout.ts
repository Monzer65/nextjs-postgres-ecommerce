"use server";

import { globalPOSTRateLimit } from "@/lib/auth/request";
import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
  invalidateUserSessions,
} from "@/lib/auth/session";
import { redirect } from "next/navigation";

export async function logoutAction(): Promise<ActionResult> {
  if (!globalPOSTRateLimit()) {
    return {
      message: "Too many requests",
    };
  }

  const { session } = await getCurrentSession();
  if (session === null) {
    return {
      message: "کاربر یافت نشد",
    };
  }
  await Promise.all([
    invalidateSession(session.id),
    invalidateUserSessions(session.user_id),
    deleteSessionTokenCookie(),
  ]);
  return redirect("/auth");
}

interface ActionResult {
  message: string;
}
