"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { usePrice } from "~/hooks/use-price";
import { RefreshCcw } from "lucide-react";


const formSchema = z.object({
    startDate: z.date({ required_error: "Field is required." }),
    endDate: z.date({ required_error: "Field is required." }),
    ratePlan: z.string({ required_error: "Field is required." }),
    price: z.number({ required_error: "Field is required." }),
    quantity: z.number({ required_error: "Field is required." }),
    minimumstay: z.number({ required_error: "Field is required." })
});

export const CreatePriceForm = () => {
    const utils = api.useUtils();
    const toast = useToast();
    const { priceDate, priceDialog, setPriceDate, setPriceDialog } = usePrice();
    const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema) });

    const ratePlans = api.rateplan.getRatePlanBySellerId.useQuery();
    const createPrice = api.price.createPrice.useMutation({
        onSuccess: async () => {
            toast.toast({
                title: "Success!",
                description: "price added successfully.",
            });
            setPriceDialog(false);
            setPriceDate({
                rateCode: "none",
                roomId: "none",
                hotelId: "none",
                subRateId: "none",
                startDate: null,
                endDate: null,
            });
            form.reset();
            await utils.price.getAllPrices.invalidate();
        },
        onError: (data) => {
            toast.toast({
                variant: "destructive",
                title: "Oop!",
                description: data.message,
            });
        },
    });

    useEffect(() => {
        if (priceDate.startDate)
            form.setValue("startDate", dayjs(priceDate.startDate).toDate());
        if (priceDate.endDate)
            form.setValue("endDate", dayjs(priceDate.endDate).toDate());
        form.setValue("ratePlan", priceDate.rateCode);
    }, [priceDate, form]);

    const formSubmitted = (data: z.infer<typeof formSchema>) => {
        createPrice.mutate({
            startDate: dayjs(data.startDate).format("YYYY-MM-DD"),
            endDate: dayjs(data.endDate).format("YYYY-MM-DD"),
            roomId: priceDate.roomId,
            ratePlan: data.ratePlan,
            rateId: priceDate.subRateId,
            price: data.price,
            hotelId: priceDate.hotelId,
            quantity: data.quantity,
            minimumstay: data.minimumstay,
            occupancy: priceDate.occupancy
        });
    };

    return (
        <Dialog open={priceDialog} onOpenChange={setPriceDialog}>
            <DialogTrigger asChild>
                <Button variant="outline">Add Price</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add price</DialogTitle>
                    <DialogDescription>
                        Add price for different time period for rooms
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(formSubmitted)}
                        className="grid gap-4 py-4"
                    >
                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Start date</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                value={field.value ? dayjs(field.value).format('YYYY-MM-DD') : ""}
                                                onChange={(e) => field.onChange(dayjs(e.target.value).startOf('day').toDate())}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>End date</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                value={field.value ? dayjs(field.value).format('YYYY-MM-DD') : ""}
                                                onChange={(e) => field.onChange(dayjs(e.target.value).startOf('day').toDate())}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="ratePlan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rate plan</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value ?? ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger disabled>
                                                <SelectValue placeholder="Select a rate plan" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {ratePlans.data?.map((ratePlan, index) => (
                                                <SelectItem key={index} value={ratePlan.code}>
                                                    {ratePlan.name}
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
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enter room price</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter room price"
                                            {...field}
                                            value={field.value ?? ""}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === "" || (/^\d+$/.test(value) && parseInt(value) >= 0))
                                                    field.onChange(value === "" ? "" : parseInt(value));
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enter quantity of room available</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter quantity of room"
                                            value={field.value ?? ""}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === "" || (/^\d+$/.test(value) && parseInt(value) >= 0))
                                                    field.onChange(value === "" ? "" : parseInt(value));
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="minimumstay"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enter minimium stay allowed</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter minimium stay allowed"
                                            value={field.value ?? ""}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === "" || (/^\d+$/.test(value) && parseInt(value) > 0))
                                                    field.onChange(value === "" ? "" : parseInt(value));
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={createPrice.isPending}>
                            {createPrice.isPending ? (
                                <>
                                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                "Add price"
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
