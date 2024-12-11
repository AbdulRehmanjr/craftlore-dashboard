import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { GITable } from "~/components/gi/gi-table";
import { TableSkeleton } from "~/components/skeletons/table";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import { HydrateClient } from "~/trpc/server";

export default async function CarbonEstimationPage() {
  const session = await auth();
  if (!session) redirect("/");
  void api.gi.giReports.prefetch();
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
              <BreadcrumbPage>GI Reporting</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <section className="grid gap-3 rounded-lg border border-dashed p-5 shadow-sm md:p-10">
        <Suspense
          fallback={
            <TableSkeleton
              headers={["Full name", "Email", "Product code", "Report"]}
            />
          }
        >
          <GITable />
        </Suspense>
      </section>
    </HydrateClient>
  );
}
