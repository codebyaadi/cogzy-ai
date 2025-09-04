"use server";

import { auth } from "@cogzy/auth/server";
import { sql } from "@cogzy/db";
import { db } from "@cogzy/db/drizzle";
import {
  conversations,
  documents,
  workspaceMembers,
  workspaces,
} from "@cogzy/db/schema/documents";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import * as z from "zod";

export type CreateWorkspaceState = {
  message: string;
  errors?: {
    name?: string[];
    description?: string[];
    color?: string[];
  };
  success: boolean;
};

const workspaceFormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Workspace name must be at least 3 characters.",
    })
    .max(50, {
      message: "Workspace name must not exceed 50 characters.",
    }),
  description: z
    .string()
    .max(200, {
      message: "Description must not exceed 200 characters.",
    })
    .optional(),
  color: z.string().nonempty({ message: "Please select a color." }),
});

/**
 * Server Action to create a new workspace.
 * @param prevState - The previous state of the form.
 * @param formData - The data submitted from the form.
 * @returns The new state of the form, including success/error messages.
 */
export async function createWorkspace(
  prevState: CreateWorkspaceState,
  formData: FormData,
): Promise<CreateWorkspaceState> {
  const validatedFields = workspaceFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    color: formData.get("color"),
  });

  if (!validatedFields.success) {
    console.error(
      "Validation failed:",
      validatedFields.error.flatten().fieldErrors,
    );
    return {
      message: "Validation failed. Please check the fields.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.session?.userId || !session?.session?.activeOrganizationId) {
      return {
        message:
          "You must be signed in and have an active organization to create a workspace.",
        success: false,
      };
    }

    const { name, description, color } = validatedFields.data;
    const { userId, activeOrganizationId } = session.session;

    await db.transaction(async (tx) => {
      const newWorkspace = await tx
        .insert(workspaces)
        .values({
          name,
          description,
          color,
          organizationId: activeOrganizationId,
          createdById: userId,
        })
        .returning({ id: workspaces.id });

      const workspaceId = newWorkspace[0]?.id;

      if (!workspaceId) {
        throw new Error("Failed to retrieve new workspace ID.");
      }

      await tx.insert(workspaceMembers).values({
        workspaceId,
        userId: session.session.userId,
        role: "admin",
      });
    });

    console.log("Saving workspace to database:", validatedFields.data);
    console.log("Workspace saved successfully.");

    revalidatePath("/workspaces");

    return {
      message: "Workspace created successfully!",
      success: true,
    };
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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const organizationId = session?.session?.activeOrganizationId;

  if (!organizationId) {
    console.error("No active organization found for session.");
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
