"use server";

import { revalidatePath } from "next/cache";
import { eq, ilike, not, and, or, sql, desc } from "@cogzy/db";
import { db } from "@cogzy/db/drizzle";
import { workspaceMembers } from "@cogzy/db/schema/documents";
import { members, users } from "@cogzy/db/schema/auth";
import { UserResult } from "@/types/user";
import { WorkspaceRole } from "@/types/workspace";
import { ActionState, getSession } from "@/lib/action";

/**
 * Checks if the current authenticated user is an admin of a given workspace.
 * @param workspaceId The ID of the workspace to check permissions for.
 * @returns A boolean indicating if the user is an admin.
 */
async function checkAdminPermissions(workspaceId: string): Promise<boolean> {
  const session = await getSession();
  if (!session?.userId) {
    return false;
  }

  const userMembership = await db
    .select({ role: workspaceMembers.role })
    .from(workspaceMembers)
    .where(
      and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, session.userId),
      ),
    )
    .limit(1);

  return userMembership[0]?.role === "admin";
}

/**
 * Fetches a list of users for a given workspace, filtering by a search query.
 * It excludes users who are already members of the specified workspace.
 * @param query The search string to filter users by name or email.
 * @param workspaceId The ID of the workspace to get users for.
 * @returns An array of UserResult objects.
 */
export async function getUsersForWorkspace(
  query: string,
  workspaceId: string,
): Promise<UserResult[]> {
  const session = await getSession();
  const organizationId = session?.activeOrganizationId;

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
        email: users.email,
        image: users.image,
      })
      .from(users)
      .innerJoin(members, eq(users.id, members.userId))
      .where(
        and(
          eq(members.organizationId, organizationId),
          or(
            ilike(users.name, normalizedQuery),
            ilike(users.email, normalizedQuery),
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

/**
 * Adds a new member to a workspace.
 * This action first verifies that the authenticated user has admin permissions
 * for the specified workspace before inserting the new member.
 * @param _prevState The previous state of the form, provided by `useFormState`.
 * @param formData The form data containing `workspaceId`, `userId`, and `role`.
 * @returns An object with a success message and status.
 */
export async function addMemberToWorkspace(
  _prevState: ActionState<void>,
  formData: FormData,
): Promise<ActionState<void>> {
  const workspaceId = formData.get("workspaceId") as string;
  const userId = formData.get("userId") as string;
  const role = formData.get("role") as WorkspaceRole;

  if (!workspaceId || !userId || !role) {
    return { message: "Missing required fields.", success: false };
  }

  const isAdmin = await checkAdminPermissions(workspaceId);
  if (!isAdmin) {
    return {
      message: "You don't have permission to manage members in this workspace.",
      success: false,
    };
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
