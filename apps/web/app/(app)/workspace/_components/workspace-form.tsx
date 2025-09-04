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
import { useEffect, useState, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import * as z from "zod";

// --- Server Action & Types (Self-Contained) ---
// By placing the action logic inside the component file, we resolve the import error.

export type CreateWorkspaceState = {
  message: string;
  errors?: {
    name?: string[];
    description?: string[];
    color?: string[];
  };
  success: boolean;
};

// --- Component Logic ---

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

  const initialState: CreateWorkspaceState = {
    message: "",
    errors: {},
    success: false,
  };
  const [state, dispatch] = useFormState(createWorkspace, initialState);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setSelectedColor(workspaceColors[0]);
      setIsOpen(false);
    }
  }, [state.success]);

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
            {state.errors?.name && (
              <p className="text-sm font-medium text-destructive">
                {state.errors.name[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="A brief description of this workspace."
              className="resize-none"
            />
            {state.errors?.description && (
              <p className="text-sm font-medium text-destructive">
                {state.errors.description[0]}
              </p>
            )}
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
            {state.errors?.color && (
              <p className="text-sm font-medium text-destructive">
                {state.errors.color[0]}
              </p>
            )}
          </div>

          {state.message && !state.success && (
            <div className="text-sm font-medium text-destructive">
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
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
