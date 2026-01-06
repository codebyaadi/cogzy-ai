"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { sql } from "@cogzy/db/drizzle";
import { db } from "@cogzy/db";
import {
  conversations,
  documents,
  workspaceMembers,
  workspaces,
} from "@cogzy/db/schema/documents";
import { CreateWorkspaceSchema } from "@cogzy/validator/schema/workspace";
import { ActionState, getSession } from "@/lib/action";

/**
 * Server Action to create a new workspace.
 * @param prevState - The previous state of the form.
 * @param formData - The data submitted from the form.
 * @returns The new state of the form, including success/error messages.
 */
export async function createWorkspace(
  _prevState: ActionState<void>,
  formData: FormData,
): Promise<ActionState<void>> {
  const validatedFields = CreateWorkspaceSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    color: formData.get("color"),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check the fields.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const session = await getSession();

  if (!session?.userId || !session?.activeOrganizationId) {
    return {
      success: false,
      message: "You must be signed in to create a workspace.",
    };
  }

  const { name, description, color } = validatedFields.data;
  const { userId, activeOrganizationId } = session;

  try {
    await db.transaction(async (tx) => {
      const workspace = await tx
        .insert(workspaces)
        .values({
          name,
          description,
          color,
          organizationId: activeOrganizationId,
          createdById: userId,
        })
        .returning({ id: workspaces.id });

      const workspaceId = workspace[0]?.id;

      if (!workspaceId) {
        throw new Error("Failed to retrieve new workspace ID.");
      }

      await tx.insert(workspaceMembers).values({
        workspaceId,
        userId,
        role: "admin",
      });

      return workspace[0];
    });

    revalidatePath("/workspaces");

    return { success: true, message: `Workspace '${name}' created.` };
  } catch (error) {
    console.error("Error creating workspace:", error);
    return {
      message: "An unexpected error occurred on the server. Please try again.",
      success: false,
    };
  }
}

/**
 * Fetches all workspaces for the current user and their active organization,
 * including aggregate counts for members, documents, and chats.
 * @returns An array of Workspace objects.
 */
export async function getWorkspaces() {
  const session = await getSession();

  const organizationId = session?.activeOrganizationId;

  if (!organizationId) {
    return [];
  }

  try {
    const allWorkspaces = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        description: workspaces.description,
        color: workspaces.color,
        createdAt: workspaces.createdAt,
        memberCount: sql<number>`count(distinct ${workspaceMembers.userId})`.as(
          "member_count",
        ),
        documentCount: sql<number>`count(distinct ${documents.id})`.as(
          "document_count",
        ),
        chatCount: sql<number>`count(distinct ${conversations.id})`.as(
          "chat_count",
        ),
        lastActivity:
          sql<string>`MAX(${sql`COALESCE(${documents.updatedAt}, ${conversations.createdAt}, ${workspaces.createdAt})`})`.as(
            "last_activity",
          ),
      })
      .from(workspaces)
      .leftJoin(
        workspaceMembers,
        sql`${workspaces.id} = ${workspaceMembers.workspaceId}`,
      )
      .leftJoin(documents, sql`${workspaces.id} = ${documents.workspaceId}`)
      .leftJoin(
        conversations,
        sql`${workspaces.id} = ${conversations.workspaceId}`,
      )
      .where(sql`${workspaces.organizationId} = ${organizationId}`)
      .groupBy(
        workspaces.id,
        workspaces.name,
        workspaces.description,
        workspaces.color,
        workspaces.createdAt,
      )
      .orderBy(sql`${workspaces.createdAt} DESC`);

    // Drizzle currently returns string for COUNT(), so map to number.
    return allWorkspaces.map((w) => ({
      ...w,
      memberCount: Number(w.memberCount),
      documentCount: Number(w.documentCount),
      chatCount: Number(w.chatCount),
      lastActivity: w.lastActivity ? new Date(w.lastActivity) : null,
    }));
  } catch (error) {
    console.error("Failed to fetch workspaces:", error);
    return [];
  }
}
