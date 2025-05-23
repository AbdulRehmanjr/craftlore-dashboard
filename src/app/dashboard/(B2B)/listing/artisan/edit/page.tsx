import Link from "next/link";
import { Suspense } from "react";
import { EditArtisan } from "~/components/listing/updation/artisan";
import { EditSkeleton } from "~/components/skeletons/updation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { HydrateClient } from "~/trpc/server";

type PageProps = {
  searchParams: Promise<{ artisanId: string }>;
};

export default async function EditArtisanPage({ searchParams }: PageProps) {
  const searchProps = await searchParams;

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
              <BreadcrumbPage>Update </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <section className="space-y-3 rounded-lg border border-dashed p-5 shadow-sm">
        <Suspense fallback={<EditSkeleton />}>
          <EditArtisan artisanId={searchProps.artisanId} />
        </Suspense>
      </section>
    </HydrateClient>
  );
}
