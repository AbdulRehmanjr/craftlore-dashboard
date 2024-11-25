"use client";

import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { useState } from "react";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { MultiSelect } from "react-multi-select-component";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "~/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem, } from "~/components/ui/select";
import { FEATURES, ROOMTYPES } from "~/constants";
import { RefreshCcw } from "lucide-react";

const formSchema = z.object({
    roomName: z.string({ required_error: "Field is required" }),
    price: z.number({ required_error: "Field is required" }),
    hotel: z.string({ required_error: "Field is required" }),
    beds: z.number({ required_error: "Field is required" }),
    capacity: z.number({ required_error: "Field is required" }),
    minimumstay: z.number({ required_error: "Field is required" }),
    roomArea: z.number({ required_error: "Field is required" }),
    quantity: z.number({ required_error: "Field is required" }),
    roomType: z.string({ required_error: "Field is required" }),
    description: z.string({ required_error: "Field is required" }),
    images: z.string({ required_error: 'Field is required.' }).array()
});

export const CreateRoomForm = () => {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    const utils = api.useUtils();
    const [selected, setSelected] = useState<FeatureProps[]>([]);
    const hotelData = api.hotel.getAllHotelBySellerId.useQuery();

    const createRoom = api.room.createRoom.useMutation({
        onSuccess: async () => {
            toast({
                title: "Success!",
                description: "Room added successfully.",
            });
            form.reset();
            await utils.room.getAllRoomsBySellerId.invalidate();
        },
        onError: (data) => {
            toast({
                variant: "destructive",
                title: "Oop!",
                description: data.message,
            });
        },
    });

    const formSubmitted = (data: z.infer<typeof formSchema>) => {
        if (selected.length == 0) {
            toast({
                variant: "destructive",
                title: "Oop!",
                description: "Please atleast upload one image.",
            });
            return;
        }
        createRoom.mutate({
            roomName: data.roomName,
            description: data.description,
            hotelId: data.hotel,
            beds: data.beds,
            capacity: data.capacity,
            area: data.roomArea,
            roomType: data.roomType,
            price: data.price,
            features: selected.map((feature: FeatureProps) => feature.value),
            images: data.images,
            quantity: data.quantity,
            minimiumstay: data.minimumstay,
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(formSubmitted)}
                className="w-full space-y-8"
            >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="shadow-md">
                        <CardHeader className="text-primary">
                            <CardTitle className="text-2xl">Room Information</CardTitle>
                            <CardDescription>
                                Enter the basic details of the room
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="roomName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Room Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter room name"
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
                                name="minimumstay"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Minimum stay for room</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter minimium stay for room"
                                                {...field}
                                                value={field.value ?? ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (
                                                        value === "" ||
                                                        (/^\d+$/.test(value) && parseInt(value) > 0)
                                                    ) {
                                                        field.onChange(value === "" ? undefined : parseInt(value));
                                                    }
                                                }}
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
                                        <FormLabel>Room Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter room description"
                                                {...field}
                                                value={field.value ?? ""}
                                                rows={4}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Room Price (Default)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter price"
                                                {...field}
                                                value={field.value ?? ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (
                                                        value === "" ||
                                                        (/^\d+$/.test(value) && parseInt(value) > 0)
                                                    ) {
                                                        field.onChange(
                                                            value === "" ? undefined : parseInt(value),
                                                        );
                                                    }
                                                }}
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
                            <CardTitle className="text-2xl">Room Capacity</CardTitle>
                            <CardDescription>
                                Specify the room&apos;s capacity details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="beds"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Number of Beds</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter number of beds"
                                                {...field}
                                                value={field.value ?? ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (
                                                        value === "" ||
                                                        (/^\d+$/.test(value) && parseInt(value) > 0)
                                                    ) {
                                                        field.onChange(
                                                            value === "" ? undefined : parseInt(value),
                                                        );
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="capacity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Room Capacity</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter room capacity"
                                                {...field}
                                                value={field.value ?? ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (
                                                        value === "" ||
                                                        (/^\d+$/.test(value) && parseInt(value) > 0)
                                                    ) {
                                                        field.onChange(
                                                            value === "" ? undefined : parseInt(value),
                                                        );
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="roomArea"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Room Area (sqm)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter room area"
                                                {...field}
                                                value={field.value ?? ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (
                                                        value === "" ||
                                                        (/^\d+$/.test(value) && parseInt(value) > 0)
                                                    ) {
                                                        field.onChange(
                                                            value === "" ? undefined : parseInt(value),
                                                        );
                                                    }
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
                                        <FormLabel>Number of Rooms</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter number of rooms"
                                                {...field}
                                                value={field.value ?? ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (
                                                        value === "" ||
                                                        (/^\d+$/.test(value) && parseInt(value) > 0)
                                                    ) {
                                                        field.onChange(
                                                            value === "" ? undefined : parseInt(value),
                                                        );
                                                    }
                                                }}
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
                            <CardTitle className="text-2xl">Room Type & Features</CardTitle>
                            <CardDescription>
                                Select room type, hotel, and features
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="roomType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Room Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value ?? ""}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a room type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {ROOMTYPES.map((roomType) => (
                                                    <SelectItem value={roomType.type} key={roomType.id}>
                                                        {roomType.type}
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
                                name="hotel"
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
                            <FormItem>
                                <FormLabel>Room Features</FormLabel>
                                <MultiSelect
                                    options={FEATURES}
                                    value={selected}
                                    onChange={setSelected}
                                    labelledBy="Select features"
                                    className="w-full"
                                />
                            </FormItem>
                        </CardContent>
                    </Card>
                </div>

                <Card className="shadow-md">
                    <CardHeader className="text-primary">
                        <CardTitle className="text-2xl">Room Images</CardTitle>
                        <CardDescription>Upload images of the room</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                                <FormItem className="grid gap-2">
                                    <FormLabel>Upload hotel logo</FormLabel>
                                    <CldUploadWidget
                                        options={{ sources: ["local"] }}
                                        uploadPreset="sshea_1"
                                        onSuccess={(result: CloudinaryUploadWidgetResults) => {
                                            const info = result.info;
                                            if (typeof info !== "string") {
                                                const secure_url = info?.secure_url ?? 'none';
                                                if (secure_url) {
                                                    const currentImages = Array.isArray(field.value) ? field.value : [];
                                                    const updatedImages = [...currentImages, secure_url];
                                                    field.onChange(updatedImages);
                                                }
                                            }
                                        }}
                                    >
                                        {({ open }) => {
                                            function handleOnClick() {
                                                open();
                                            }
                                            return (
                                                <Button type="button" onClick={handleOnClick} className="w-fit bg-primary text-white ">
                                                    Upload files
                                                </Button>
                                            );
                                        }}
                                    </CldUploadWidget>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </CardContent>
                </Card>
                <div className="flex justify-center">
                    <Button
                        type="submit"
                        className="w-full max-w-md"
                        disabled={createRoom.isPending}
                    >
                        {createRoom.isPending ? (
                            <>
                                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                                Creating room...
                            </>
                        ) : (
                            "Create room"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
