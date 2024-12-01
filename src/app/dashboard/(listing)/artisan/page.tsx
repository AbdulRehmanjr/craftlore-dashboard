import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ArtisanTable } from "~/components/listing/artisan";
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
import { api, HydrateClient } from "~/trpc/server";

export default async function ArtisanPage() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  void api.listing.getArtisans.prefetch();

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
              <BreadcrumbPage>Artisan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <section className="flex flex-1 rounded-lg border border-dashed p-5 shadow-sm md:p-10">
        <Suspense
          fallback={
            <TableSkeleton
              headers={[
                "Full name",
                "Address",
                "Speciality",
                "Experience",
                "Skill",
                "Market",
                "Status"
              ]}
            />
          }
        >
          <ArtisanTable />
        </Suspense>
      </section>
    </HydrateClient>
  );
}
