import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CreatePriceCalendar } from "~/components/price/calendar";
import { SimpleLoader } from "~/components/skeletons/simple";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "~/components/ui/breadcrumb";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function PricePage() {

    const session = await auth();

  if (!session) {
    redirect('/')
  }
  
    void api.price.getAllPrices.prefetch();
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
                            <BreadcrumbPage>Price</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <section className="flex rounded-lg border border-dashed p-5 shadow-sm md:p-10">
                <Suspense fallback={<SimpleLoader />}>
                    <CreatePriceCalendar />
                </Suspense>
            </section>
        </HydrateClient>
    );
}
