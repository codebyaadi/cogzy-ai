"use client";

import { inviteUserToOrg } from "@/server/organization";
import { Button } from "@cogzy/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@cogzy/ui/components/dialog";
import { Input } from "@cogzy/ui/components/input";
import { Label } from "@cogzy/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@cogzy/ui/components/select";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Sending..." : "Send Invitation"}
    </Button>
  );
}

export function InviteMemberDialog() {
  const [state, formAction] = useActionState(inviteUserToOrg, null);
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      // On success, close the dialog and reset the form
      setIsOpen(false);
      formRef.current?.reset();
      // Consider showing a toast notification here for better UX
      // toast.success(state.success);
    }
  }, [state]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Invite Member</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite New Member</DialogTitle>
          <DialogDescription>
            Enter the email address and role for the new member.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="mt-4 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="new.member@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select name="role" defaultValue="member" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <SubmitButton />
          {state?.error && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
