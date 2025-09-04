// workspace/page.tsx

import { Avatar, AvatarFallback } from "@cogzy/ui/components/avatar";
import { Badge } from "@cogzy/ui/components/badge";
import { Button } from "@cogzy/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cogzy/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@cogzy/ui/components/dropdown-menu";
import { formatRelativeTime } from "@cogzy/utils";
import {
  Eye,
  Folder,
  FolderPlus,
  MoreVertical,
  Plus,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import { CreateWorkspaceDialog } from "./_components/workspace-form";
import { AddMemberDialog } from "./_components/add-member-dialog"; // Import the new component

import { getWorkspaces as fetchWorkspaces } from "@/server/workspace";

type Workspace = {
  id: string;
  name: string;
  description: string | null;
  color: string;
  memberCount: number;
  documentCount: number;
  chatCount: number;
  lastActivity: Date | null;
};

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

// We need to make the WorkspaceCard a client component since it will now use a client component within its dropdown.
// Alternatively, we can make the DropdownMenu items their own client components.
// The best practice is to "lift state up" and render the dialog at a higher level,
// but for simplicity, we will add a trigger button to the card's dropdown.
const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => (
  <Card className="flex flex-col hover:shadow-xl transition-shadow duration-300">
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`w-12 h-12 ${workspace.color} rounded-lg flex items-center justify-center shrink-0`}
          >
            <Folder className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">
              {workspace.name}
            </CardTitle>
            <CardDescription className="text-sm mt-1 line-clamp-2">
              {workspace.description}
            </CardDescription>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              <span>View</span>
            </DropdownMenuItem>

            {/* Add the AddMemberDialog here */}
            <AddMemberDialogTrigger workspaceId={workspace.id} />

            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500 focus:text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>
    <CardContent className="flex-grow space-y-4">
      <div className="flex justify-around bg-muted/50 p-3 rounded-md text-center">
        <div>
          <p className="text-lg font-bold text-foreground">
            {workspace.documentCount}
          </p>
          <p className="text-xs text-muted-foreground">Documents</p>
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">
            {workspace.chatCount}
          </p>
          <p className="text-xs text-muted-foreground">Chats</p>
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">
            {workspace.memberCount}
          </p>
          <p className="text-xs text-muted-foreground">Members</p>
        </div>
      </div>
    </CardContent>
    <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
      <div className="flex -space-x-2">
        {Array.from({ length: Math.min(workspace.memberCount, 4) }).map(
          (_, index) => (
            <Avatar key={index} className="h-8 w-8 border-2 border-background">
              <AvatarFallback className="text-xs">
                {String.fromCharCode(65 + index)}
              </AvatarFallback>
            </Avatar>
          ),
        )}
        {workspace.memberCount > 4 && (
          <Avatar className="h-8 w-8 border-2 border-background">
            <AvatarFallback className="text-xs font-medium bg-muted">
              +{workspace.memberCount - 4}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
      <Badge variant="outline">
        {workspace.lastActivity
          ? formatRelativeTime(workspace.lastActivity)
          : "No activity"}
      </Badge>
    </CardFooter>
  </Card>
);

// We create a separate client component for the dialog trigger to prevent the whole card from becoming a client component
const AddMemberDialogTrigger = ({ workspaceId }: { workspaceId: string }) => (
  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
    <AddMemberDialog workspaceId={workspaceId}>
      <Users className="mr-2 h-4 w-4" />
      <span>Manage Members</span>
    </AddMemberDialog>
  </DropdownMenuItem>
);

// --- Page Component ---
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
