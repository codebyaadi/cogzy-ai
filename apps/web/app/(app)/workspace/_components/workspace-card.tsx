"use client";

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
import {
  Eye,
  Folder,
  MoreVertical,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@cogzy/ui/components/avatar";
import { Badge } from "@cogzy/ui/components/badge";
import { formatRelativeTime } from "@cogzy/utils";
import { AddMemberDialog } from "./add-member-dialog"; // Import the AddMemberDialog here

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

export const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => (
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

            {/* Use the AddMemberDialog directly inside a DropdownMenuItem */}
            <AddMemberDialog workspaceId={workspace.id}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Users className="mr-2 h-4 w-4" />
                <span>Manage Members</span>
              </DropdownMenuItem>
            </AddMemberDialog>

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
