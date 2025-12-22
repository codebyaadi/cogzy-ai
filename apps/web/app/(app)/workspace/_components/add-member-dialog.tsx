"use client";

import {
  useState,
  useTransition,
  useEffect,
  useActionState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useFormStatus } from "react-dom";
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
import { Label } from "@cogzy/ui/components/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@cogzy/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@cogzy/ui/components/popover";
import { Check, UserPlus, Loader2 } from "lucide-react";
import {
  getUsersForWorkspace,
  addMemberToWorkspace,
} from "@/server/workspace-members";
import { cn } from "@cogzy/ui/lib/utils";
import { WORKSPACE_ROLES } from "@/constants/workspace";
import { WorkspaceRole } from "@/types/workspace";

const MIN_SEARCH_LENGTH = 3;
const SEARCH_DEBOUNCE_MS = 300;

type User = { id: string; name: string; email: string; image: string | null };

// Memoized submit button to prevent unnecessary re-renders
function SubmitButton({ isSelected }: { isSelected: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || !isSelected}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "Adding..." : "Add Member"}
    </Button>
  );
}

// Memoized role selector
const RoleSelector = ({
  selectedRole,
  onRoleChange,
}: {
  selectedRole: WorkspaceRole;
  onRoleChange: (role: WorkspaceRole) => void;
}) => (
  <div className="space-y-2">
    <Label>Assign Role</Label>
    <div className="flex gap-2">
      {WORKSPACE_ROLES.map((role) => (
        <Button
          key={role.value}
          type="button"
          size="sm"
          variant={selectedRole === role.value ? "secondary" : "outline"}
          onClick={() => onRoleChange(role.value)}
        >
          {role.label}
        </Button>
      ))}
    </div>
  </div>
);

// Custom hook for user search logic
function useUserSearch(workspaceId: string) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isPending, startTransition] = useTransition();

  // Use refs to prevent race conditions
  const currentQueryRef = useRef("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const searchUsers = useCallback(
    async (searchQuery: string) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (searchQuery.length < MIN_SEARCH_LENGTH) {
        setUsers([]);
        return;
      }

      // Create new abort controller and update current query
      abortControllerRef.current = new AbortController();
      currentQueryRef.current = searchQuery;

      startTransition(async () => {
        try {
          const results = await getUsersForWorkspace(searchQuery, workspaceId);

          // Only update if this is still the current query and not aborted
          if (
            currentQueryRef.current === searchQuery &&
            !abortControllerRef.current?.signal.aborted
          ) {
            setUsers(results);
          }
        } catch (error) {
          // Only log non-abort errors
          if (error instanceof Error && error.name !== "AbortError") {
            console.error("Search error:", error);
            if (currentQueryRef.current === searchQuery) {
              setUsers([]);
            }
          }
        }
      });
    },
    [workspaceId],
  );

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(query);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [query, searchUsers]);

  const resetSearch = useCallback(() => {
    setQuery("");
    setUsers([]);
    currentQueryRef.current = "";
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    query,
    setQuery,
    users,
    isPending,
    resetSearch,
  };
}

export function AddMemberDialog({
  workspaceId,
  children,
}: {
  workspaceId: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<WorkspaceRole>("editor");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { query, setQuery, users, isPending, resetSearch } =
    useUserSearch(workspaceId);

  const initialState = { message: "", success: false };
  const [state, dispatch] = useActionState(addMemberToWorkspace, initialState);

  // Memoize popover width calculation
  const popoverWidth = useMemo(
    () => triggerRef.current?.offsetWidth,
    [popoverOpen], // Only recalculate when popover opens
  );

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedUser(null);
      setSelectedRole("editor");
      resetSearch();
    }
  }, [isOpen, resetSearch]);

  // Handle successful submission
  useEffect(() => {
    if (state.success) {
      setIsOpen(false);
    }
  }, [state.success]);

  // Memoized user selection handler
  const handleUserSelect = useCallback((user: User) => {
    setSelectedUser(user);
    setPopoverOpen(false);
  }, []);

  // Memoized role change handler
  const handleRoleChange = useCallback((role: WorkspaceRole) => {
    setSelectedRole(role);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Invite a new member to this workspace.
          </DialogDescription>
        </DialogHeader>

        <form action={dispatch} className="space-y-4">
          <input type="hidden" name="workspaceId" value={workspaceId} />
          <input type="hidden" name="userId" value={selectedUser?.id ?? ""} />
          <input type="hidden" name="role" value={selectedRole} />

          <div className="space-y-2">
            <Label htmlFor="user-search">Select a User</Label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="user-search"
                  ref={triggerRef}
                  variant="outline"
                  className="w-full justify-between font-normal"
                  aria-expanded={popoverOpen}
                  aria-haspopup="listbox"
                >
                  <span className="truncate">
                    {selectedUser?.name || "Search users..."}
                  </span>
                  <UserPlus className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="p-0"
                align="start"
                style={{ width: popoverWidth }}
              >
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search users..."
                    value={query}
                    onValueChange={setQuery}
                  />
                  <CommandList>
                    {query.length < MIN_SEARCH_LENGTH ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Type at least {MIN_SEARCH_LENGTH} characters to search
                      </div>
                    ) : isPending ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span className="text-sm">Searching...</span>
                      </div>
                    ) : users.length === 0 ? (
                      <CommandEmpty>No users found.</CommandEmpty>
                    ) : (
                      <CommandGroup heading="Available Users">
                        {users.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={`${user.name} ${user.email || ""}`}
                            onSelect={() => handleUserSelect(user)}
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedUser?.id === user.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            <div className="flex items-center gap-3 w-full">
                              {user.image ? (
                                <img
                                  src={user.image}
                                  alt={user.name}
                                  className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium flex-shrink-0">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="font-medium truncate">
                                  {user.name}
                                </span>
                                {user.email && (
                                  <span className="text-xs text-muted-foreground truncate">
                                    {user.email}
                                  </span>
                                )}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <RoleSelector
            selectedRole={selectedRole}
            onRoleChange={handleRoleChange}
          />

          {state.message && (
            <div
              className={cn(
                "text-sm font-medium",
                state.success ? "text-green-600" : "text-destructive",
              )}
              role={state.success ? "status" : "alert"}
              aria-live="polite"
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
