import { pgEnum } from "drizzle-orm/pg-core";

export const documentStatusEnum = pgEnum("document_status", [
  "pending",
  "uploading",
  "processing",
  "completed",
  "failed",
]);

export const workspaceRoleEnum = pgEnum("workspace_role", [
  "admin",
  "editor",
  "viewer",
]);

export const messageRoleEnum = pgEnum("message_role", ["user", "assistant"]);
