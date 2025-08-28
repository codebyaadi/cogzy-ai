"use client";

import * as React from "react";
import {
  FolderOpen,
  History,
  LayoutDashboard,
  MessageSquare,
  Users,
  FileTextIcon,
} from "lucide-react";

import { NavMain } from "@/components/layouts/sidebar/nav-main";
import { NavUser } from "@/components/layouts/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@cogzy/ui/components/sidebar";
import { useRouter } from "next/navigation";
import { authClient } from "@cogzy/auth/client";
import CogzyLogo from "@/components/logo";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Chat",
      url: "/chat",
      icon: MessageSquare,
      items: [],
    },
    {
      title: "Documents",
      url: "/documents",
      icon: FileTextIcon,
      items: [],
    },
    {
      title: "Workspace",
      url: "/workspace",
      icon: FolderOpen,
      items: [],
    },
    {
      title: "History",
      url: "/history",
      icon: History,
      items: [],
    },
    {
      title: "Team",
      url: "/team",
      icon: Users,
      items: [],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  function handleLogout() {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin");
        },
      },
    });
  }

  return (
    <Sidebar className="!bg-transparent" collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex aspect-square size-8 items-center justify-center">
          <CogzyLogo />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: session?.user.name!,
            email: session?.user.email!,
            avatar: session?.user.image ?? "",
          }}
          isLoading={isPending}
          onLogout={handleLogout}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
