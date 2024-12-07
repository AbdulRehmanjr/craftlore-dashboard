import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ArtisanTable } from "~/components/listing/artisan";
import { BusinessTable } from "~/components/listing/business";
import { InstituteTable } from "~/components/listing/institute";
import { TableSkeleton } from "~/components/skeletons/table";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function InstitutePage() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  void api.listing.getInstitutes.prefetch();
  void api.listing.getArtisans.prefetch();
  void api.listing.getBusinesses.prefetch();

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
              <BreadcrumbPage>Listing</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <section className="flex flex-1 rounded-lg border border-dashed p-5 shadow-sm md:p-10">
        <Tabs defaultValue="artisans" className="w-full">
          <TabsList>
            <TabsTrigger value="artisans">Artisans</TabsTrigger>
            <TabsTrigger value="Businesses">Businesses</TabsTrigger>
            <TabsTrigger value="Institutes">Institutes</TabsTrigger>
          </TabsList>
          <TabsContent value="artisans">
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
                    "Status",
                  ]}
                />
              }
            >
              <ArtisanTable />
            </Suspense>
          </TabsContent>
          <TabsContent value="Businesses">
            <Suspense
              fallback={
                <TableSkeleton
                  headers={[
                    "Name",
                    "Address",
                    "Email",
                    "Type",
                    "No. of employee",
                    "Sell",
                    "Status",
                  ]}
                />
              }
            >
              <BusinessTable />
            </Suspense>
          </TabsContent>
          <TabsContent value="Institutes">
            <Suspense
              fallback={
                <TableSkeleton
                  headers={[
                    "Name",
                    "Address",
                    "Email",
                    "Type",
                    "Mission",
                    "Representative",
                    "Designation",
                    "Status",
                  ]}
                />
              }
            >
              <InstituteTable />
            </Suspense>
          </TabsContent>
        </Tabs>
      </section>
    </HydrateClient>
  );
}
