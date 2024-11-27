import Link from "next/link";
import { SectionForm } from "~/components/carbon/section/section-form";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";

type SearchProps = {
  searchParams: Promise<{ subId: string }>;
};

export default async function CarbonSubCategoryPage({
  searchParams,
}: SearchProps) {
  const params = await searchParams;
  return (
    <>
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
                <Link href="/dashboard/carbon">Carbon</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Sub category</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <section className="grid rounded-lg border border-dashed p-5 shadow-sm md:p-10">
        <SectionForm subId={params.subId}/>
      </section>
    </>
  );
}
