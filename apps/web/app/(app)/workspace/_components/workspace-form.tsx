"use client";

import { createWorkspace } from "@/server/workspace";
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
import { Textarea } from "@cogzy/ui/components/textarea";
import { cn } from "@cogzy/ui/lib/utils";
import { Plus } from "lucide-react";
import { useEffect, useState, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { ActionState } from "@/lib/action";

const workspaceColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-red-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-indigo-500",
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Workspace"}
    </Button>
  );
}

export function CreateWorkspaceDialog({ label }: { label: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedColor, setSelectedColor] = useState(workspaceColors[0]);

  // The initial state should match the return type of the server action's failure state.
  const initialState = {
    message: "",
    success: false,
    errors: undefined,
  };

  const [state, dispatch] = useActionState<ActionState<void>, FormData>(
    createWorkspace,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setSelectedColor(workspaceColors[0]);
      setIsOpen(false);
      toast.success(state.message, {
        description: "Your workspace has been created successfully.",
      });
    } else if (!state.success && state.message) {
      // Handle validation errors with toast
      if (state.errors && !Array.isArray(state.errors)) {
        // Show individual field errors
        Object.entries(state.errors).forEach(([field, fieldErrors]) => {
          if (fieldErrors && fieldErrors.length > 0) {
            toast.error(
              `${field.charAt(0).toUpperCase() + field.slice(1)} Error`,
              {
                description: fieldErrors[0],
              },
            );
          }
        });
      } else {
        // Show general error message
        toast.error("Error", {
          description: state.message,
        });
      }
    }
  }, [state]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create a New Workspace</DialogTitle>
          <DialogDescription>
            Workspaces help you organize your documents and chats.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={dispatch} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Workspace Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Q4 Marketing Campaign"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="A brief description of this workspace."
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <input type="hidden" name="color" value={selectedColor} />
            <div className="grid grid-cols-8 gap-2">
              {workspaceColors.map((colorClass) => (
                <button
                  type="button"
                  key={colorClass}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 transition-transform duration-150",
                    colorClass,
                    selectedColor === colorClass
                      ? "border-primary ring-2 ring-primary ring-offset-2"
                      : "border-transparent hover:scale-110",
                  )}
                  onClick={() => setSelectedColor(colorClass)}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
