import { z } from "zod";

export const AddMemberToWorkspaceSchema = z.object({
  workspaceId: z.string().min(1, "Workspace ID is required"),
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(["admin", "member", "viewer"], {
    message: "Invalid role specified",
  }),
});

export const CreateWorkspaceSchema = z.object({
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
