"use client";

import Image from "next/image";
import { Briefcase, FileUser, Grid, Home, Settings, Wrench } from "lucide-react";
import { NavMain } from "~/components/sidebar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";

const data = {
  items: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "B2B - Listing",
      url: "#",
      icon: Grid,
      items: [
        { title: "Listing", url: "/dashboard/listing" },
        { title: "Ranking", url: "/dashboard/ranking" }
      ],
    },
    {
      title: "Membership",
      url: "#",
      icon: Briefcase,
      items: [
        { title: "Buyer", url: "/dashboard/buyer" },
        { title: "Corporate", url: "/dashboard/corporate" },
        { title: "Sponsor", url: "/dashboard/sponsor" },
      ],
    },
    {
      title: "Applications",
      url: "/dashboard/application",
      icon: FileUser,
    },
    {
      title: "Employee",
      url: "#",
      icon: Briefcase,
      items: [
        { title: "All employees", url: "/dashboard/employee" },
        { title: "Create employee", url: "/dashboard/employee/create" },
      ],
    },
    {
      title: "Tools",
      url: "#",
      icon: Wrench,
      items: [
        { title: "Carbon footprinting", url: "/dashboard/carbon" },
        { title: "Price estimation", url: "/dashboard/price" },
        { title: "GI authentication", url: "/dashboard/employee/create" },
        { title: "Blockchain", url: "/dashboard/employee/create" },
        { title: "Craft profiling", url: "/dashboard/craft-profile" },
      ],
    },
    {
      title: "Setting",
      url: "/dashboard/setting",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="relative my-2 h-16 w-full">
        <Image className="object-contain" src="/logo.png" alt="logo" fill />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.items} />
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
