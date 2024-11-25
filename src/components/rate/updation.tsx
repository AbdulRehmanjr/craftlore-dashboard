"use client";

import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "~/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "~/components/ui/select";
import { useEffect } from "react";
import { MEALPLANS } from "~/constants";
import { RefreshCcw } from "lucide-react";

const formSchema = z.object({
    rateName: z.string({ required_error: "Field is required" }),
    hotelId: z.string({ required_error: "Field is required" }),
    mealId: z.string({ required_error: "Field is required" }),
    description: z.string({ required_error: "Field is required" }),
});

export const RateEditForm = ({ rateId }: { rateId: string }) => {

    const utils = api.useUtils()
    const { toast } = useToast();
    const [rateData] = api.rateplan.getRateById.useSuspenseQuery({ rateId: rateId });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            hotelId: rateData.hotelId,
            mealId: rateData.mealId + ""
        }
    });
    const hotelData = api.hotel.getAllHotelBySellerId.useQuery();
    const editRatePlan = api.rateplan.updateRatePlan.useMutation({
        onSuccess: async () => {
            toast({
                title: "Success!",
                description: "Rate plan modified successfully.",
            });
            await utils.rateplan.getRatePlanBySellerId.invalidate()
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Oop!",
                description: "Something went wrong.",
            });
        },
    });

    useEffect(() => {
        form.setValue('rateName', rateData.name)
        form.setValue('description', rateData.description)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rateData])

    const formSubmitted = (data: z.infer<typeof formSchema>) => {
        editRatePlan.mutate({
            rateId: rateId,
            rateName: data.rateName,
            code: rateData.code ?? "none",
            description: data.description,
            mealId: +data.mealId,
            hotelId: data.hotelId,
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(formSubmitted)}
                className="w-full space-y-8"
            >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card className="shadow-md">
                        <CardHeader className="text-primary">
                            <CardTitle className="text-2xl">Rate plan Information</CardTitle>
                            <CardDescription>
                                Enter the basic details of the rate plan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="rateName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rate plan name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter rate plan name"
                                                {...field}
                                                value={field.value ?? ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rate plan description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter rate plan description"
                                                {...field}
                                                value={field.value ?? ""}
                                                rows={4}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card className="shadow-md">
                        <CardHeader className="text-primary">
                            <CardTitle className="text-2xl">Hotel & Meal</CardTitle>
                            <CardDescription>
                                Select hotel and meal type for rate plan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="mealId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Meal type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value ?? ""}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a meal type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {MEALPLANS.map((meal) => (
                                                    <SelectItem value={`${meal.code}`} key={meal.code}>
                                                        {meal.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="hotelId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hotel</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value ?? ""}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a hotel" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {hotelData.data?.map((hotel) => (
                                                    <SelectItem key={hotel.hotelId} value={hotel.hotelId}>
                                                        {hotel.hotelName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-center">
                    <Button
                        type="submit"
                        className="w-full max-w-md"
                        disabled={editRatePlan.isPending}
                    >
                        {editRatePlan.isPending ? (
                            <>
                                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                                Updating plan...
                            </>
                        ) : (
                            "Update rate plan"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
