// workspace/_components/add-member-dialog.tsx
"use client";

import { Button } from "@cogzy/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@cogzy/ui/components/dialog";
import { Input } from "@cogzy/ui/components/input";
import { Label } from "@cogzy/ui/components/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@cogzy/ui/components/command";
import { Check, Plus, UserPlus } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  getUsersForWorkspace,
  addMemberToWorkspace,
} from "@/server/workspace-members";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@cogzy/ui/components/popover";
import { cn } from "@cogzy/ui/lib/utils";

const roles = [
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
  { value: "viewer", label: "Viewer" },
];

function SubmitButton({ isSelected }: { isSelected: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || !isSelected}>
      {pending ? "Adding..." : "Add Member"}
    </Button>
  );
}

export function AddMemberDialog({
  workspaceId,
  children,
}: {
  workspaceId: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedRole, setSelectedRole] = useState("member");
  const [popoverOpen, setPopoverOpen] = useState(false);

  const initialState = { message: "", success: false };
  const [state, dispatch] = useFormState(addMemberToWorkspace, initialState);

  useEffect(() => {
    if (query.length > 2) {
      startTransition(async () => {
        const results = await getUsersForWorkspace(query, workspaceId);
        setUsers(results);
      });
    } else {
      setUsers([]);
    }
  }, [query, workspaceId, startTransition]);

  useEffect(() => {
    if (state.success) {
      setIsOpen(false);
      setSelectedUser(null);
      setQuery("");
    }
  }, [state.success]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* Render the children as the trigger */}
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Invite a new member to this workspace.
          </DialogDescription>
        </DialogHeader>
        <form action={dispatch} className="space-y-4">
          <input type="hidden" name="workspaceId" value={workspaceId} />
          <input type="hidden" name="userId" value={selectedUser?.id || ""} />
          <input type="hidden" name="role" value={selectedRole} />

          <div className="space-y-2">
            <Label>Select a User</Label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start font-normal"
                >
                  {selectedUser ? selectedUser.name : "Search users..."}
                  <UserPlus className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search users..."
                    value={query}
                    onValueChange={setQuery}
                  />
                  {isPending && (
                    <p className="p-2 text-center text-sm">Searching...</p>
                  )}
                  {!isPending && (
                    <CommandList>
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup heading="Available Users">
                        {users.map((user) => (
                          <CommandItem
                            key={user.id}
                            onSelect={() => {
                              setSelectedUser(user);
                              setPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedUser?.id === user.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {user.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  )}
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Assign Role</Label>
            <div className="flex gap-2">
              {roles.map((role) => (
                <Button
                  key={role.value}
                  type="button"
                  variant={
                    selectedRole === role.value ? "secondary" : "outline"
                  }
                  onClick={() => setSelectedRole(role.value)}
                >
                  {role.label}
                </Button>
              ))}
            </div>
          </div>

          {state.message && (
            <div
              className={`text-sm font-medium ${state.success ? "text-green-500" : "text-red-500"}`}
            >
              {state.message}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <SubmitButton isSelected={!!selectedUser} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
