import Link from "next/link";
import { CarbonSubCategoryForm } from "~/components/carbon/subcategory/add-sub";
import { CarbonSubCategoryList } from "~/components/carbon/subcategory/sub-list";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { api, HydrateClient } from "~/trpc/server";

type SearchProps = {
  searchParams: Promise<{ categoryId: string }>;
};

export default async function CarbonCategoryPage({
  searchParams,
}: SearchProps) {
  const params = await searchParams;

  void api.category.getSubByCatId.prefetch({categoryId:params.categoryId});
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
              <BreadcrumbLink asChild>
                <Link href="/dashboard/carbon">Category</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Sub category</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <section className="grid grid-cols-12 gap-3 rounded-lg border border-dashed p-5 shadow-sm md:p-10">
        <div className="col-span-12 flex justify-end">
          <CarbonSubCategoryForm categoryId={params.categoryId} />
        </div>
        <CarbonSubCategoryList categoryId={params.categoryId} />
      </section>
    </HydrateClient>
  );
}
