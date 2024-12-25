"use client";

import * as React from "react";
import {
  Bot,
  Plus,
  Server,
  SquareTerminal,
  Ticket,
  FolderOpen,
  Users,
  Files
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { DashboardNav } from "./dashboard-nav";


// This is sample data.
const data = {
  adminDashboard: [
    {
      title: "My Users",
      url: "/admin/dashboard/users",
      icon: Users,
    },
    {
      title: "All Posts",
      url: "/admin/dashboard/posts",
      icon: Files,
      isActive: true,
    },
  ],
  navMain: [
    {
      title: "All Posts",
      url: "/blogs",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Create New",
      url: "/create",
      icon: Plus,
    },
  ],
  projects: [
    {
      name: "Book a Ticket",
      url: "#",
      gitlink : "#",
      icon: Ticket,
    },
    {
      name: "Pro Ecommerce",
      url: "#",
      gitlink : "#",
      icon: Server,
    },
    {
      name: "ChatGPT Clone",
      url: "#",
      gitlink : "#",
      icon: Bot,
    },
    {
      name: "My Portfolio",
      url: "#",
      gitlink : "#",
      icon: FolderOpen,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { data: session } = useSession();
  const user = session?.user;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {user?.role === "ADMIN" && <DashboardNav items={data.adminDashboard} user={user} />}
        
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
