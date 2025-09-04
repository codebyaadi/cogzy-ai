// server/workspace-members.ts
"use server";

import { db } from "@cogzy/db/drizzle";
import { workspaceMembers } from "@cogzy/db/schema/documents";
import { members, users } from "@cogzy/db/schema/auth"; // Correct import for the 'members' table
import { eq, like, not, and, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@cogzy/auth/server";
import { headers } from "next/headers";

export type UserResult = {
  id: string;
  name: string;
};

export async function getUsersForWorkspace(
  query: string,
  workspaceId: string,
): Promise<UserResult[]> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const organizationId = session?.session?.activeOrganizationId;
  if (!organizationId) {
    return [];
  }

  const normalizedQuery = `%${query.toLowerCase()}%`;

  const usersInWorkspace = db
    .select({ userId: workspaceMembers.userId })
    .from(workspaceMembers)
    .where(eq(workspaceMembers.workspaceId, workspaceId));

  try {
    const availableUsers = await db
      .select({
        id: users.id,
        name: users.name,
      })
      .from(users)
      // Corrected join to use the `members` table from auth.ts
      .innerJoin(members, eq(users.id, members.userId))
      .where(
        and(
          eq(members.organizationId, organizationId),
          or(
            like(sql`LOWER(${users.name})`, normalizedQuery),
            like(sql`LOWER(${users.email})`, normalizedQuery),
          ),
          not(sql`${users.id} IN (${usersInWorkspace})`),
        ),
      )
      .limit(10);

    return availableUsers;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

type AddMemberState = {
  message: string;
  success: boolean;
};

export async function addMemberToWorkspace(
  prevState: AddMemberState,
  formData: FormData,
): Promise<AddMemberState> {
  const workspaceId = formData.get("workspaceId") as string;
  const userId = formData.get("userId") as string;
  const role = formData.get("role") as "admin" | "editor" | "viewer";

  if (!workspaceId || !userId || !role) {
    return { message: "Missing required fields.", success: false };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session?.userId) {
    return { message: "Unauthorized.", success: false };
  }

  try {
    await db.insert(workspaceMembers).values({
      workspaceId,
      userId,
      role,
    });

    revalidatePath(`/workspaces`);
    return { message: "Member added successfully!", success: true };
  } catch (error) {
    console.error("Error adding member:", error);
    return { message: "Failed to add member.", success: false };
  }
}
