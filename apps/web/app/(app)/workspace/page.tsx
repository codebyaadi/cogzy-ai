import { FolderPlus } from "lucide-react";
import { CreateWorkspaceDialog } from "./_components/workspace-form";

import { getWorkspaces as fetchWorkspaces } from "@/server/workspace";
import { WorkspaceCard } from "./_components/workspace-card";

const EmptyState = () => (
  <div className="text-center border-2 border-dashed border-border rounded-lg p-12 mt-6">
    <div className="mx-auto w-fit bg-secondary p-4 rounded-full">
      <FolderPlus className="h-8 w-8 text-muted-foreground" />
    </div>
    <h2 className="mt-6 text-xl font-semibold text-foreground">
      No Workspaces Yet
    </h2>
    <p className="mt-2 text-sm text-muted-foreground">
      Get started by creating a new workspace to organize your documents and
      collaborate with your team.
    </p>
    <CreateWorkspaceDialog label="Create Your First Workspace" />
  </div>
);

export default async function WorkspacePage() {
  const workspaces = await fetchWorkspaces();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Workspaces
          </h1>
          <p className="text-muted-foreground mt-1">
            Collaborate with your team by organizing documents and chats.
          </p>
        </div>
        {workspaces.length > 0 && (
          <CreateWorkspaceDialog label="Create Workspace" />
        )}
      </div>

      {workspaces.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      )}
    </div>
  );
}
