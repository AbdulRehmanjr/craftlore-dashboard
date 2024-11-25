import { redirect } from "next/navigation";
import { Suspense } from "react";
import { RoomTable } from "~/components/room/table";
import { TableSkeleton } from "~/components/skeletons/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "~/components/ui/breadcrumb";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function RoomPage() {

  const session = await auth();

  if (!session) {
    redirect('/')
  }
  void api.room.getAllRoomsBySellerId.prefetch();

  return (
    <HydrateClient>
      <div className="flex flex-col justify-center gap-4 my-2">
        <Breadcrumb>
          <BreadcrumbList className="text-primary">
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Rooms</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <section className="flex flex-1 rounded-lg border border-dashed p-5 shadow-sm md:p-10">
        <Suspense
          fallback={
            <TableSkeleton
              headers={[
                "Room name",
                "Room type",
                "Hotel name",
                "Quantity",
                "Capacity",
                "Beds",
                "Area",
              ]}
            />
          }
        >
          <RoomTable />
        </Suspense>
      </section>
    </HydrateClient>
  );
}
