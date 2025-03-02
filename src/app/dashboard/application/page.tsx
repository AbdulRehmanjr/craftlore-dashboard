import Link from "next/link";
import { Suspense } from "react";
import { AppliedJobs } from "~/components/application/job";
import { TableSkeleton } from "~/components/skeletons/table";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { api, HydrateClient } from "~/trpc/server";

export const dynamic ='force-dynamic'
export default function JobListingPage() {

  void api.employ.getAppliedJobs.prefetch()
  return (
    <HydrateClient>
      <div className="my-2 flex flex-col justify-center gap-4">
        <Breadcrumb>
          <BreadcrumbList className="text-primary">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Ranks</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <section className="space-y-3 rounded-lg border border-dashed p-5 shadow-sm">
        <h1 className="text-2xl font-bold">Job Applications</h1>
        <Suspense
          fallback={
            <TableSkeleton
              headers={[
                "Full Nam",
                "Email",
                "Job Position",
                "Job Code",
                "Resume",
                "Cover Letter",
              ]}
            />
          }
        >
          <AppliedJobs />
        </Suspense>
      </section>
    </HydrateClient>
  );
}
