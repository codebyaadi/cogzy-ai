import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";

import { eq } from "@cogzy/db";
import { db } from "@cogzy/db/drizzle";
import * as schema from "@cogzy/db/schema/auth";
import { members, organizations } from "@cogzy/db/schema/auth";
import { sendEmail } from "@cogzy/email";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      user: schema.users,
    },
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    nextCookies(),
    organization({
      teams: {
        enabled: true,
        maximumTeams: 10,
      },
      async sendInvitationEmail({
        id: inviteId,
        email,
        inviter,
        organization,
      }) {
        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invitation/${inviteId}`;
        await sendEmail(email, "Subject", "InvitationEmail", {
          invitedByName: inviter.user.name,
          organizationName: organization.name,
          inviteLink: inviteLink,
          userName: email,
        });
      },
    }),
  ],
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          try {
            const result = await db
              .select()
              .from(members)
              .innerJoin(
                organizations,
                eq(members.organizationId, organizations.id),
              )
              .where(eq(members.userId, session.userId))
              .limit(1);

            if (!result[0]) {
              throw new Error(
                `No organization found for user ${session.userId}`,
              );
            }

            const org = result[0].organizations;

            return {
              data: {
                ...session,
                activeOrganizationId: org.id,
              },
            };
          } catch (error) {
            console.error(
              "Auth hook: Failed to set active organization:",
              error,
            );

            return { data: session };
          }
        },
      },
    },
  },
});
