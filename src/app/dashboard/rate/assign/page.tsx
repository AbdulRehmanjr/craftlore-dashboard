import { Suspense } from "react";
import { RateAssignForm } from "~/components/rate/assignment/assign-form";
import { AssignedRoomList } from "~/components/rate/assignment/assign-list";
import { SimpleLoader } from "~/components/skeletons/simple";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "~/components/ui/breadcrumb";
import { api, HydrateClient } from "~/trpc/server";

export default async function AssignRatePlanPage({ searchParams }: { searchParams: Promise<{ rateId: string }> }) {

  const params = await searchParams
  void api.rateplan.getAllRoomsByRateId.prefetch({ rateId: params.rateId });
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
              <BreadcrumbLink href="/dashboard/rate">
                Rate plans
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Assign rate plan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 rounded-lg border border-dashed p-5 shadow-sm md:p-10">
        <AssignedRoomList rateId={params.rateId} />
        <Suspense fallback={<SimpleLoader />}>
          <RateAssignForm rateId={params.rateId} />
        </Suspense>
      </section>
    </HydrateClient>
  );
}
