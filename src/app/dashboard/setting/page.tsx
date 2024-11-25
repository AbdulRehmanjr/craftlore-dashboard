import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CalendarConnection } from "~/components/setting/calendar-connection";
import { PasswordReset } from "~/components/setting/passoword-forget";
import { PayPalConnection } from "~/components/setting/paypal-connection";
import { CardLoader } from "~/components/skeletons/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "~/components/ui/breadcrumb";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function SettingsPage() {
    const session = await auth();
    if (!session) redirect("/");
    void api.paypal.paypalConnection.prefetch();
    void api.calendar.calendarConnection.prefetch();
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
                            <BreadcrumbPage>Settings</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <section className="flex flex-col gap-2 rounded-lg border border-dashed p-5 shadow-sm md:p-10">
                <Suspense fallback={<CardLoader />}>
                    <PayPalConnection />
                </Suspense>
                <Suspense fallback={<CardLoader />}>
                    <CalendarConnection />
                </Suspense>
                <PasswordReset />
            </section>
        </HydrateClient>
    );
}
