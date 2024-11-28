import Link from "next/link";
import { CarbonMaterialForm } from "~/components/carbon/material/add-material";
import { CarbonMaterialList } from "~/components/carbon/material/material-list";
import { SectionForm } from "~/components/carbon/section/section-form";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

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
                <Link href="/dashboard/carbon">Carbon foorprint</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Sub category</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <section className="grid gap-4 rounded-lg border border-dashed p-5 shadow-sm md:p-10">
        <Card>
          <CardHeader>
            <CardTitle>Materials</CardTitle>
            <CardDescription>Material for category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <CarbonMaterialForm subId={params.subId}/>
            <CarbonMaterialList subId={params.subId}/>
          </CardContent>
        </Card>
        <SectionForm subId={params.subId}/>
      </section>
    </>
  );
}
