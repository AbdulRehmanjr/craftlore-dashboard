import Link from "next/link";
import { Suspense } from "react";
import { BuyerMembershipTable } from "~/components/membership/buyer";
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

export const dynamic = "force-dynamic";
export default function BuyerMembershipPage() {
  void api.member.getBuyerMemberships.prefetch();

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
              <BreadcrumbPage>Buyer</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <section className="space-y-3 rounded-lg border border-dashed p-5 shadow-sm">
        <Suspense
          fallback={
            <TableSkeleton
              headers={[
                "Full name",
                "Business",
                "BuyerType",
                "Country",
                "Order",
                "Volume",
                "Products",
                "Newsletter",
                "Joined"
              ]}
            />
          }
        >
          <BuyerMembershipTable />
        </Suspense>
      </section>
    </HydrateClient>
  );
}
