import Link from "next/link";
import { Suspense } from "react";
import { UpdateEmployeeForm } from "~/components/employee/updation";
import { SimpleLoader } from "~/components/skeletons/simple";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "~/components/ui/breadcrumb";
import { api, HydrateClient } from "~/trpc/server";

export default async function EditEmployeePage({ params }: { params: Promise<{ employeeId: string }> }) {

  const param = await params
  void api.employ.getEmployeeById.prefetch({ employeeId: param.employeeId });

  return (
    <HydrateClient>
      <div className="flex flex-col justify-center gap-4 my-2">
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
                <Link href="/dashboard/employee">Employees</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <section className="flex flex-1 rounded-lg border border-dashed p-5 shadow-sm md:p-10">
        <Suspense fallback={<SimpleLoader />}>
          <UpdateEmployeeForm employeeId={param.employeeId} />
        </Suspense>
      </section>
    </HydrateClient>
  );
}
