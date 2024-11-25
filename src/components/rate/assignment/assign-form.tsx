"use client";

import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "~/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "~/components/ui/select";
import { useToast } from "~/hooks/use-toast";
import { Input } from "~/components/ui/input";
import { RefreshCcw } from "lucide-react";

const formSchema = z.object({
    room: z.string({ required_error: "Field is required" }),
    occupancy: z.number({ required_error: "Field is required" })
});

export const RateAssignForm = ({ rateId }: { rateId: string }) => {

    const [rooms] = api.rateplan.getAllRoomsByRateId.useSuspenseQuery({ rateId: rateId });
    const { toast } = useToast();
    const utils = api.useUtils();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const createRoomRate = api.rateplan.createRoomRatePlan.useMutation({
        onSuccess: async () => {
            toast({
                title: "Success!",
                description: "Room assigned successfully.",
            });
            await utils.rateplan.getAllRoomsByRateId.invalidate();
            form.reset();
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Oop!",
                description: "Something went wrong.",
            });
        },
    });

    const formSubmitted = (data: z.infer<typeof formSchema>) => {
        const [roomId, hotelId, hotelName] = data.room.split("@");
        if (roomId && hotelId && hotelName)
            createRoomRate.mutate({
                rateId: rateId,
                roomId: roomId,
                occupancy: +data.occupancy,
                hotelId: hotelId,
                hotelName: hotelName,
            });
    };
    return (
        <>
            {
                rooms.length == 0 ?
                    <Card className="w-full shadow-md">
                        <CardHeader className="text-primary">
                            <CardTitle className="text-2xl">Rooms to assign</CardTitle>
                            <CardDescription>
                                Select room to assign a rate plan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <strong className="text-2xl text-red-600">
                                This rate plan is assigned to all rooms
                            </strong>
                        </CardContent>
                    </Card> : <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(formSubmitted)}
                            className="w-full space-y-8"
                        >
                            <div className="grid gap-6">
                                <Card className="shadow-md">
                                    <CardHeader className="text-primary">
                                        <CardTitle className="text-2xl">Rooms to assign</CardTitle>
                                        <CardDescription>
                                            Select room to assign a rate plan.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="room"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Select a room</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value ?? ""}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a room" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {rooms.map((room) => (
                                                                <SelectItem
                                                                    value={`${room.roomId}@${room.hotelId}@${room.hotel.hotelName}`}
                                                                    key={room.roomId}
                                                                >
                                                                    {room.roomName}
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
                                            name="occupancy"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>No. of guests</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter no. of guests"
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
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex w-full justify-center">
                                            <Button
                                                type="submit"
                                                className="w-full max-w-md"
                                                disabled={createRoomRate.isPending}
                                            >
                                                {createRoomRate.isPending ? (
                                                    <>
                                                        <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                                                        Assiging...
                                                    </>
                                                ) : (
                                                    "Assign"
                                                )}
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>
                        </form>
                    </Form>
            }
        </>
    )
};
