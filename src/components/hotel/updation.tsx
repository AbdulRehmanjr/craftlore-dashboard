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
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { BOARDS, HOTELFEATURES, HOTELTIMES, HOTELTYPES, ISLANDS } from "~/constants";
import { useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import { Checkbox } from "~/components/ui/checkbox";


const formSchema = z.object({
    hotelName: z.string({ required_error: "Field is required" }),
    island: z.string({ required_error: "Field is required" }),
    address: z.string({ required_error: "Field is required" }),
    hotelType: z.string({ required_error: "Field is required" }),
    longitude: z.number({ required_error: "Field is required" }),
    latitude: z.number({ required_error: "Field is required" }),
    budget: z.number({ required_error: "Field is required" }),
    rooms: z.number({ required_error: "Field is required" }),
    occupancy: z.number({ required_error: "Field is required" }),
    description: z.string({ required_error: "Field is required" }),
    firstName: z.string({ required_error: "Field is required" }),
    lastName: z.string({ required_error: "Field is required" }),
    email: z.string({ required_error: "Field is required" }),
    phone: z.string({ required_error: "Field is required" }),
    checkIn: z.string({ required_error: "Field is required" }),
    checkOut: z.string({ required_error: "Field is required" }),
    hotelLogo: z.string({ required_error: "Field is required." }),
    images: z
      .array(z.string())
      .min(1, { message: "At least one image must be selected" }),
    features: z
      .array(z.string())
      .min(1, { message: "At least one feature must be selected" }),
    boards: z
      .array(z.string())
      .min(1, { message: "At least one board must be selected" }),
  });

export const EditHotelForm = ({ hotelId }: { hotelId: string }) => {

    const [hotelData] = api.hotel.getHotelById.useSuspenseQuery({ hotelId: hotelId });
    const { toast } = useToast();
    const utils = api.useUtils()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            hotelType: hotelData.hotelType + "",
            island:hotelData.island,
            checkIn: hotelData.checkIn,
            checkOut: hotelData.checkOut
        }
    });

    const updateHotel = api.hotel.updateHotelInfoById.useMutation({
        onSuccess: async () => {
            toast({
                title: "Success!",
                description: "Hotel modified successfully.",
            });
            await utils.hotel.getHotelById.invalidate()
            await utils.hotel.getAllHotelBySellerId.invalidate();
        },
        onError: (data) => {
            toast({
                variant: "destructive",
                title: "Oop!",
                description: data.message
            });
        },
    });

    useEffect(() => {
        form.setValue('hotelLogo',hotelData.hotelLogo)
        form.setValue('hotelName', hotelData.hotelName)
        form.setValue('island', hotelData.island)
        form.setValue('address', hotelData.address)
        form.setValue('longitude', hotelData.longitude)
        form.setValue('latitude', hotelData.latitude)
        form.setValue('description', hotelData.description)
        form.setValue('firstName', hotelData.firstName)
        form.setValue('lastName', hotelData.lastName)
        form.setValue('email', hotelData.email)
        form.setValue('phone', hotelData.phone)
        form.setValue('hotelLogo', hotelData.hotelLogo)
        form.setValue('features', hotelData.features)
        form.setValue('boards',hotelData.boards)
        form.setValue('budget',hotelData.budget)
        form.setValue('rooms',hotelData.rooms)
        form.setValue('occupancy',hotelData.occupancy)
        form.setValue('images',hotelData.images)
    }, [form, hotelData])

    const formSubmitted = (data: z.infer<typeof formSchema>) => {
        updateHotel.mutate({
            hotelId: hotelId,
            hotelCode: hotelData.code ?? "none",
            hotelName: data.hotelName,
            island: data.island,
            address: data.address,
            hotelType: data.hotelType,
            longitude: data.longitude,
            latitude: data.latitude,
            description: data.description,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            hotelLogo: data.hotelLogo,
            features: data.features,
            images: data.images,
            boards: data.boards,
            budget:data.budget,
            rooms:data.rooms,
            occupancy:data.occupancy
        });
    };

    return (
        <Form {...form}>
      <form
        onSubmit={form.handleSubmit(formSubmitted)}
        className="w-full space-y-8"
      >
        <div className="grid gap-6">
          <Card className="shadow-md">
            <CardHeader className="text-primary">
              <CardTitle className="text-2xl">Hotel information</CardTitle>
              <CardDescription>
                Enter the basic details of the hotel
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="hotelName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the hotel name"
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
                name="hotelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type of hotel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {HOTELTYPES.map((hotel) => (
                          <SelectItem
                            value={hotel.value + ""}
                            key={hotel.value}
                          >
                            {hotel.label}
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
                name="island"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Island</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select island" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ISLANDS.map((island) => (
                            <SelectItem value={island} key={island}>
                              {island}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter address of hotel"
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
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Enter the latitude of hotel`}
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                            field.onChange(
                              value === "" ? undefined : parseFloat(value),
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
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Enter the longitude of hotel`}
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                            field.onChange(
                              value === "" ? undefined : parseFloat(value),
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
                name="features"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2 lg:col-span-3">
                    <FormLabel>Hotel amenities</FormLabel>
                    <div className="flex flex-wrap gap-4">
                      {HOTELFEATURES.map((feature) => (
                        <div
                          key={feature.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={feature.value}
                            checked={
                              field.value
                                ? field.value.includes(feature.value)
                                : false
                            }
                            onCheckedChange={(checked) => {
                              const updatedFeatures = checked
                                ? [...(field.value || []), feature.value]
                                : (field.value || []).filter(
                                    (val) => val !== feature.value,
                                  );
                              field.onChange(updatedFeatures);
                            }}
                          />
                          <label htmlFor={feature.value} className="text-sm">
                            {feature.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="boards"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2 lg:col-span-3">
                    <FormLabel>Hotel boarding</FormLabel>
                    <div className="flex flex-wrap gap-4">
                      {BOARDS.map((board) => (
                        <div
                          key={board.code}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={board.code}
                            checked={
                              field.value
                                ? field.value.includes(board.code)
                                : false
                            }
                            onCheckedChange={(checked) => {
                              const updatedFeatures = checked
                                ? [...(field.value || []), board.code]
                                : (field.value || []).filter(
                                    (val) => val !== board.code,
                                  );
                              field.onChange(updatedFeatures);
                            }}
                          />
                          <label
                            htmlFor={board.code}
                            className="text-sm"
                          >
                            {board.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2 lg:col-span-3">
                    <FormLabel>Hotel description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter hotel description"
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
                name="checkIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check in</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select check in time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {HOTELTIMES.map((time, index) => (
                          <SelectItem value={time} key={index}>
                            {time}
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
                name="checkOut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check out</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select check out time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {HOTELTIMES.map((time, index) => (
                          <SelectItem value={time} key={index}>
                            {time}
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
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum budget per night</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Enter the budget of hotel`}
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                            field.onChange(
                              value === "" ? undefined : parseFloat(value),
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
                name="rooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. of rooms</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Enter the room of hotel`}
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                            field.onChange(
                              value === "" ? undefined : parseFloat(value),
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
                name="occupancy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum occupancy per room</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Enter the occupancy `}
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                            field.onChange(
                              value === "" ? undefined : parseFloat(value),
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
                name="hotelLogo"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Upload hotel logo</FormLabel>
                    <CldUploadWidget
                      options={{ sources: ["local"] }}
                      uploadPreset="sshea_1"
                      onSuccess={(result: CloudinaryUploadWidgetResults) => {
                        const info = result.info;
                        if (typeof info !== "string") {
                          const secure_url = info?.secure_url ?? "none";
                          if (secure_url) {
                            field.onChange(secure_url);
                          }
                        }
                      }}
                    >
                      {({ open }) => {
                        function handleOnClick() {
                          open();
                        }
                        return (
                          <Button
                            type="button"
                            onClick={handleOnClick}
                            className="w-fit bg-primary text-white"
                          >
                            Upload logo
                          </Button>
                        );
                      }}
                    </CldUploadWidget>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem className="col-span-1 grid gap-3 md:col-span-2 lg:col-span-3">
                    <FormLabel>Upload hotel images</FormLabel>
                    <CldUploadWidget
                      options={{ sources: ["local"] }}
                      uploadPreset="sshea_1"
                      onSuccess={(result: CloudinaryUploadWidgetResults) => {
                        const info = result.info;
                        if (typeof info !== "string") {
                          const secure_url = info?.secure_url ?? "none";
                          if (secure_url) {
                            const currentImages = Array.isArray(field.value)
                              ? field.value
                              : [];
                            const updatedImages = [
                              ...currentImages,
                              secure_url,
                            ];
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
                          <Button
                            type="button"
                            onClick={handleOnClick}
                            className="w-fit bg-primary text-white"
                          >
                            Upload images
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
          <Card className="h-fit shadow-md">
            <CardHeader className="text-primary">
              <CardTitle className="text-2xl">Hotel owner details</CardTitle>
              <CardDescription>
                Enter the basic details of the hotel owner
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter first name"
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
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter last name"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter the email"
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the phone no."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
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
            disabled={updateHotel.isPending}
          >
            {updateHotel.isPending ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              "Create hotel"
            )}
          </Button>
        </div>
      </form>
    </Form>
    );
};
