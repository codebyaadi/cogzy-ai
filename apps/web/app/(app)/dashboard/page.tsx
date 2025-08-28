"use client";

import { authClient } from "@cogzy/auth/client";

export default function DashboardPage() {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  return (
    <div className="flex flex-col gap-6">
      <div>Dashboard - To be done</div>
      <div>
        {activeOrganization ? <p>{activeOrganization.name}</p> : "null"}
      </div>
    </div>
  );
}
