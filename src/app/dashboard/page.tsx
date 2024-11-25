import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "~/components/ui/breadcrumb";


export default async function DashboardPage() {

    return (
        <>
            <Breadcrumb className="col-span-11">
                <BreadcrumbList className="text-primary">
                    <BreadcrumbItem>
                        <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </>
    );
}
