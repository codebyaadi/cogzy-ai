"use server";

import { auth } from "@cogzy/auth/server";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";

/**
 * A consistent state type for all server actions.
 */
export type ActionState<T> =
  | { success: true; message: string; data?: T; errors?: never }
  | {
      success: false;
      message: string;
      errors?: Record<string, string[]> | string[];
    };

/**
 * Retrieves the current user's session.
 * This function is memoized using `unstable_cache` to prevent redundant
 * calls to the authentication service during a single request lifecycle.
 *
 * It correctly handles dynamic data (headers) by using a separate, non-cached
 * function to fetch the headers and pass them as an argument to the cached function.
 * This ensures that a unique cache entry is created for each user's session,
 * preventing security vulnerabilities and data-stale issues.
 *
 * @returns The user session object or null if no session exists.
 */
export async function getSession() {
  const sessionData = await auth.api.getSession({ headers: await headers() });

  if (!sessionData) {
    return null;
  }

  const getCachedSession = unstable_cache(
    async (dynamicSessionData: typeof sessionData.session) =>
      dynamicSessionData,
    ["session"],
    {
      tags: ["auth-session"],
    },
  );
  return getCachedSession(sessionData?.session);
}
