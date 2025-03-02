import { PasswordReset } from "~/components/setting/passoword-forget";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "~/components/ui/breadcrumb";

export default  function SettingsPage() {
    
    return (
        <>
            <div className="flex flex-col justify-center gap-4 my-2">
                <Breadcrumb>
                    <BreadcrumbList className="text-primary">
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Settings</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <section className="flex flex-col gap-2 rounded-lg border border-dashed p-5 shadow-sm md:p-10">
                <PasswordReset />
            </section>
        </>
    );
}
