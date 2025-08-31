"use server";

import { auth } from "@cogzy/auth/server";
import { generateSlug } from "@cogzy/utils/string";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * The shape of the state object returned by form actions.
 */
type FormState =
  | { error: string; success?: undefined }
  | { success: string; error?: undefined }
  | null;

/**
 * Creates a new organization for the currently authenticated user.
 * Redirects to the dashboard on success.
 * @param {FormData} formData - The form data, which must contain an 'org-name' field.
 * @throws {Error} If the organization name is not provided.
 */
export async function createOrganization(formData: FormData) {
  const orgName = formData.get("org-name") as string;

  if (!orgName) {
    throw new Error("Organization name is required.");
  }

  const orgSlug = await generateSlug(orgName);

  await auth.api.createOrganization({
    body: {
      name: orgName,
      slug: orgSlug,
    },
    headers: await headers(),
  });

  redirect("/dashboard");
}

/**
 * Invites a new user to the currently active organization by email.
 * @param {FormState} prevState - The previous state of the form action.
 * @param {FormData} formData - The form data containing the user's 'email' and 'role'.
 */
export async function inviteUserToOrg(
  prevState: FormState,
  formData: FormData,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || !session.session.activeOrganizationId) {
    return { error: "You must be logged in to invite users." };
  }

  const email = formData.get("email") as string;
  const role = formData.get("role") as "member" | "admin" | "owner";

  if (!email || !role) {
    return { error: "Email and role are required." };
  }

  try {
    await auth.api.createInvitation({
      body: {
        email: email,
        role: role,
        organizationId: session.session.activeOrganizationId,
      },
      headers: await headers(),
    });

    revalidatePath("/dashboard/members");
    return { success: `Invitation sent to ${email}.` };
  } catch (error) {
    console.error("Failed to invite user:", error);
    return { error: "An unexpected error occurred." };
  }
}

/**
 * Defines the options for fetching organization members.
 */
type GetMembersOptions = {
  limit?: number;
  offset?: number;
  sortBy?: "createdAt" | "role";
  sortDirection?: "asc" | "desc";
  filterField?: "role";
  filterOperator?: "eq" | "ne" | "lt" | "lte" | "gt" | "gte" | "contains";
  filterValue?: string;
};

/**
 * Fetches the members of the user's active organization.
 * @param {GetMembersOptions} options - Optional parameters for pagination, sorting, and filtering.
 */
export async function getOrganizationMembers(options: GetMembersOptions = {}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const organizationId = session?.session?.activeOrganizationId;

    if (!organizationId) {
      console.warn(
        "getOrganizationMembers: No active organization ID found in session.",
      );
      return [];
    }

    const {
      limit = 20,
      offset = 0,
      sortBy = "createdAt",
      sortDirection = "desc",
      ...filterOptions
    } = options;

    const response = await auth.api.listMembers({
      query: {
        organizationId,
        limit,
        offset,
        sortBy,
        sortDirection,
        ...filterOptions,
      },
      headers: await headers(),
    });

    return response.members || [];
  } catch (error) {
    console.error("Failed to fetch organization members:", error);
    return [];
  }
}

/**
 * Accepts an organization invitation for the logged-in user.
 * Redirects to the dashboard on success.
 * @param {string} invitationId - The unique identifier of the invitation to accept.
 */
export async function acceptInvitation(invitationId: string) {
  if (!invitationId) {
    return { error: "Invitation ID is required." };
  }

  try {
    await auth.api.acceptInvitation({
      body: {
        invitationId,
      },
      headers: await headers(),
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Failed to accept invitation:", error);
    return {
      error: "An unexpected error occurred while accepting the invitation.",
    };
  }

  redirect("/dashboard");
}
