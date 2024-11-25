import { Suspense } from "react";
import { RateEditForm } from "~/components/rate/updation";
import { SimpleLoader } from "~/components/skeletons/simple";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "~/components/ui/breadcrumb";
import { api, HydrateClient } from "~/trpc/server";

export default async function EditRatePlanPage({ params }: { params: Promise<{ rateId: string }> }) {

  const param = await params
  void api.rateplan.getRateById.prefetch({ rateId: param.rateId });
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
              <BreadcrumbLink href="/dashboard/rates">
                Rate plans
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit rate plan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <section className="flex flex-1 rounded-lg border border-dashed p-5 shadow-sm md:p-10">
        <Suspense fallback={<SimpleLoader />}>
          <RateEditForm rateId={param.rateId} />
        </Suspense>
      </section>
    </HydrateClient>
  );
}
