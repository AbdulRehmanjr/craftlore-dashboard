import { Suspense } from "react";
import { EditHotelForm } from "~/components/hotel/updation";
import { SimpleLoader } from "~/components/skeletons/simple";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "~/components/ui/breadcrumb";
import { api, HydrateClient } from "~/trpc/server";

export default async function EditHotelPage({ params }: { params: Promise<{ hotelId: string }> }) {

  const param = await params
  void api.hotel.getHotelById.prefetch({ hotelId: param.hotelId });

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
              <BreadcrumbLink href="/dashboard/hotel">Hotels</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <section className="flex flex-1 rounded-lg border border-dashed p-5 shadow-sm md:p-10">
        <Suspense fallback={<SimpleLoader />}>
          <EditHotelForm hotelId={param.hotelId} />
        </Suspense>
      </section>
    </HydrateClient>
  );
}
