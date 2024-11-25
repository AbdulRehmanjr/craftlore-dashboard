import { Suspense } from "react";
import { EditRoomForm } from "~/components/room/updation";
import { SimpleLoader } from "~/components/skeletons/simple";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "~/components/ui/breadcrumb";
import { api, HydrateClient } from "~/trpc/server";

export default async function EditHotelPage({ params }: { params: Promise<{ roomId: string }> }) {

  const param = await params
  void api.room.getRoomById.prefetch({ roomId: param.roomId });
  void api.hotel.getAllHotelBySellerId.prefetch();
  return (
    <HydrateClient>
      <div className="flex flex-col justify-center gap-4">
        <Breadcrumb>
          <BreadcrumbList className="text-primary">
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/room">Rooms</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Room</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-lg font-semibold text-primary md:text-2xl">
          Edit room
        </h1>
      </div>
      <section className="flex flex-1 rounded-lg border border-dashed p-5 shadow-sm md:p-10">
        <Suspense fallback={<SimpleLoader />}>
          <EditRoomForm roomId={param.roomId} />
        </Suspense>
      </section>
    </HydrateClient>
  );
}
