import { redirect } from "next/navigation";
import { Suspense } from "react";
import { HotelTable } from "~/components/hotel/table";
import { TableSkeleton } from "~/components/skeletons/table";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "~/components/ui/breadcrumb";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function HotelPage() {

    const session = await auth();

  if (!session) {
    redirect('/')
  }
  
    void api.hotel.getAllHotelBySellerId.prefetch();

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
                            <BreadcrumbPage>Hotels</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <section className="flex flex-1 rounded-lg border border-dashed p-5 shadow-sm md:p-10">
                <Suspense
                    fallback={
                        <TableSkeleton
                            headers={[
                                "Hotel logo",
                                "Hotel name",
                                "Manager",
                                "Location",
                                "Island",
                                "Creation time",
                                "Action",
                            ]}
                        />
                    }
                >
                    <HotelTable />
                </Suspense>
            </section>
        </HydrateClient>
    );
}
