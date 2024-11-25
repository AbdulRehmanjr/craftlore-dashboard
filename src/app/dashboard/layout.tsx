import { AppSidebar } from "~/components/sidebar/side-bar";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";


export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <SidebarProvider className="col-span-12">
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                    </div>
                </header>
                <main className="min-h-[100vh] flex-1 flex-col rounded-xl  border border-dashed  md:min-h-min gap-4 p-4 m-4 ">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>


    );
}