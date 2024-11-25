"use client"

import Image from "next/image"
import { Bed, Building, Calendar, Currency, Euro, Home, ListOrdered, Map, Plus, Settings, Ticket, } from "lucide-react"
import { NavMain } from "~/components/sidebar/nav-main"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, } from "~/components/ui/sidebar"

const data = {
  items: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Bookings",
      url: "#",
      icon: ListOrdered,
      items: [
        { title: "Genesis", url: "#" },
        { title: "Explorer", url: "#" },
        { title: "Quantum", url: "#" },
      ],
    },
    {
      title: "Calendar",
      url: "/dashboard",
      icon: Calendar,
    },
    {
      title: "Hotel",
      url: "#",
      icon: Building,
      items: [
        { title: "All hotels", url: "/dashboard/hotel" },
        { title: "Create hotel", url: "/dashboard/hotel/create" },
      ],
    },
    {
      title: "Room",
      url: "#",
      icon: Bed,
      items: [
        { title: "All rooms", url: "/dashboard/room" },
        { title: "Create room", url: "/dashboard/room/create" },
      ],
    },
    {
      title: "Rate plan",
      url: "#",
      icon: Currency,
      items: [
        { title: "All rates", url: "/dashboard/rate" },
        { title: "Create rate", url: "/dashboard/rate/create" },
      ],
    },
    {
      title: "Channel Mapping",
      url: "#",
      icon: Map,
    },
    {
      title: "Price",
      url: "/dashboard/price",
      icon: Euro,
    },
    {
      title: "Extra",
      url: "#",
      icon: Plus,
    },
    {
      title: "Discount",
      url: "#",
      icon: Ticket,
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
      <SidebarHeader className="relative w-full h-16 my-2">
        <Image className="object-contain" src="/logo_1.png" alt="logo" fill />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.items} />
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
