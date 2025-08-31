import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@cogzy/ui/components/avatar";
import { getOrganizationMembers } from "@/server/organization";
import { InviteMemberDialog } from "../_components/invite-member-dialog";

export default async function MembersPage() {
  const members = await getOrganizationMembers();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Members</h2>
          <p className="text-muted-foreground">
            Manage your organization's members and their roles.
          </p>
        </div>
        <InviteMemberDialog />
      </header>

      <div className="rounded-md border">
        <div className="divide-y divide-border">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src={member.user.image || ""}
                    alt={member.user.name}
                  />
                  <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.user.email}
                  </p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground capitalize">
                {member.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
