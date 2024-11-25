'use client'

import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { useToast } from "~/hooks/use-toast"
import { api } from "~/trpc/react"

export const CalendarConnection = () => {

    const router = useRouter()
    const toast = useToast()
    const [isConnected] = api.calendar.calendarConnection.useSuspenseQuery()

    const createUrl = api.calendar.googleOAuth.useMutation({
        onSuccess: (data: string) => {
            router.push(data)
        },
        onError: (data) => {
            toast.toast({
                variant: 'destructive',
                title: "Error",
                description: data.message
            })
        }

    })
    return (
        <Card className="w-full">
            <CardHeader className="text-primary">
                <CardTitle>Calendar OnBoarding</CardTitle>
                <CardDescription>Connect your account to calendar.</CardDescription>
            </CardHeader>
            <CardFooter >
                <Button type="button" title="calendar-connection" onClick={() => createUrl.mutate()}
                    disabled={(isConnected ?? true) || createUrl.isPending}
                >
                    {isConnected ? "Connected" : "Connect to calendar"}
                </Button>
            </CardFooter>
        </Card>
    )

}