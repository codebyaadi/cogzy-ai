import { v4 as uuidv4 } from "uuid";
import { jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { organizations, users } from "./auth";
import {
  documentStatusEnum,
  messageRoleEnum,
  workspaceRoleEnum,
} from "../enums/documents";

export const workspaces = pgTable("workspaces", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  color: text("color").notNull(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  createdById: text("created_by_id")
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workspaceMembers = pgTable("workspace_members", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: workspaceRoleEnum("role").default("viewer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const documents = pgTable("documents", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: varchar("name", { length: 512 }).notNull(),
  status: documentStatusEnum("status").default("pending").notNull(),
  errorMessage: text("error_message"),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  uploadedById: text("uploaded_by_id")
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const conversations = pgTable("conversations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  topic: varchar("topic", { length: 256 }).notNull(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  createdById: text("created_by_id")
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  content: text("content").notNull(),
  role: messageRoleEnum("role").notNull(),
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  sources: jsonb("sources"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
