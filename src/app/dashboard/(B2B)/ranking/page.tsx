import Link from "next/link";
import { Suspense } from "react";
import { RankArtisanTable } from "~/components/ranking/artisan";
import { RankBusinessTable } from "~/components/ranking/business";
import { RankInstituteTable } from "~/components/ranking/insitute";
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
import { HydrateClient } from "~/trpc/server";

export default function RankListingPage() {
  

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
        <h1 className="text-2xl font-bold">Listing Ranks</h1>
        <Tabs defaultValue="artisans" className="w-full">
          <TabsList>
            <TabsTrigger value="artisans">Artisans</TabsTrigger>
            <TabsTrigger value="businesses">Businesses</TabsTrigger>
            <TabsTrigger value="institutes">Institutes</TabsTrigger>
          </TabsList>
          <TabsContent value="artisans">
            <Suspense
              fallback={
                <TableSkeleton
                  headers={[
                    "Full name",
                    "Specialty",
                    "Skill",
                    "Experience",
                    "Rank",
                    "Status",
                  ]}
                />
              }
            >
              <RankArtisanTable />
            </Suspense>
          </TabsContent>
          <TabsContent value="businesses">
            <Suspense
              fallback={
                <TableSkeleton
                  headers={[
                    "Name",
                    "Type",
                    "Market",
                    "Years of Operation",
                    "Rank",
                    "Status",
                  ]}
                />
              }
            >
              <RankBusinessTable />
            </Suspense>
          </TabsContent>
          <TabsContent value="institutes">
            <Suspense
              fallback={
                <TableSkeleton
                  headers={[
                    "Name",
                    "Type",
                    "Mission",
                    "Representative",
                    "Rank",
                    "Status",
                  ]}
                />
              }
            >
              <RankInstituteTable />
            </Suspense>
          </TabsContent>
        </Tabs>
      </section>
    </HydrateClient>
  );
}