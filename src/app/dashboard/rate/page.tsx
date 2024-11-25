import { redirect } from "next/navigation";
import { Suspense } from "react";
import { RateTable } from "~/components/rate/table";
import { TableSkeleton } from "~/components/skeletons/table";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "~/components/ui/breadcrumb";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function PricePage() {

  const session = await auth();

  if (!session) {
    redirect('/')
  }
  void api.rateplan.getRatePlanBySellerId.prefetch();

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
              <BreadcrumbPage>Rate plans</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <section className="flex rounded-lg border border-dashed p-5 shadow-sm md:p-10">
        <Suspense
          fallback={
            <TableSkeleton
              headers={[
                "Rate name",
                "Rate code",
                "Hotel name",
                "Meal id",
                "Actions",
              ]}
            />
          }
        >
          <RateTable />
        </Suspense>
      </section>
    </HydrateClient>
  );
}
