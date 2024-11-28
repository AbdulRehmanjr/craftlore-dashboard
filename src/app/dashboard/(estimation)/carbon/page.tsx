import Link from "next/link";
import { redirect } from "next/navigation";
import { CarbonCategoryForm } from "~/components/carbon/category/add-category";
import { CarbonCategoryList } from "~/components/carbon/category/category-list";
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

export default  async function CarbonEstimationPage() {

  const session = await auth()
  if(!session) redirect('/')
  void api.carbon.getCategories.prefetch();
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
              <BreadcrumbPage>Category</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <section className="grid grid-cols-12 gap-3 rounded-lg border border-dashed p-5 shadow-sm md:p-10">
          <div className="col-span-12 flex justify-end">
            <CarbonCategoryForm/>
          </div>
          <CarbonCategoryList/>
      </section>
    </HydrateClient>
  );
}
