'use client'

import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { useToast } from "~/hooks/use-toast"
import { api } from "~/trpc/react"

export const PayPalConnection = () => {

    const toast = useToast()
    const router = useRouter()
    const [isConnected] = api.paypal.paypalConnection.useSuspenseQuery()
    const paypalconnection = api.paypal.connectToPayPal.useMutation({
        onSuccess: (data: string) => {
            router.push(data)
        },
        onError: (error) => {
            toast.toast({
                variant: 'destructive',
                title: "Error",
                description: error.message
            })
        }
    })

    return (
        <Card className="w-full">
            <CardHeader className="text-primary">
                <CardTitle>Account OnBoarding</CardTitle>
                <CardDescription>Connect your account to paypal.</CardDescription>
            </CardHeader>
            <CardFooter >
                <Button type="button" onClick={() => paypalconnection.mutate()}
                    disabled={(isConnected) || paypalconnection.isPending}
                >
                    {isConnected ? "Connected" : "Connect to PayPal"}
                </Button>
            </CardFooter>
        </Card>
    )
}