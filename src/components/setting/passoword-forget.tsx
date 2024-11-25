"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "~/components/ui/form"
import { api } from "~/trpc/react"
import { useSession } from "next-auth/react"


const formSchema = z.object({
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
})

export const PasswordReset = () => {

    const session = useSession()
    const updatePassword = api.registration.updatePassword.useMutation()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        updatePassword.mutate({ updatedPassword: values.password, email: session.data?.user.email ?? '' })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Password Reset</CardTitle>
                <CardDescription>Reset your password.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter new password"  {...field} value={field.value ?? ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter new password" {...field} value={field.value ?? ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-start">
                            <Button type="submit" disabled={updatePassword.isPending}>Submit</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
