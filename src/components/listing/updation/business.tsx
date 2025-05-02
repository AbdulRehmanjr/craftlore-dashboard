"use client";

import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { Loader2, SaveIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import { useToast } from "~/hooks/use-toast";

// Define the schema with non-optional string fields
const EditBusinessSchema = z.object({
  // Business model fields
  businessId: z.string(),
  businessName: z.string().min(1, { message: "Business name is required" }),
  businessEmail: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  businessAddress: z.string(),
  businessType: z.enum([
    "None",
    "Large_Enterprice",
    "Mid_sized_Business",
    "Small_Business",
    "Startup",
  ]),
  businessSold: z.string(),
  businessEmployee: z.coerce.number().min(0),
  status: z.string(),
  listingCriteria: z.string(),
  documents: z.array(z.string()),
  businessMarket: z.enum(["None", "Local", "National", "International"]),
  yearOfOperation: z.coerce.number().min(1),

  // User model fields
  userId: z.string(),
  fullName: z.string().min(1, { message: "Full name is required" }),
  phone: z.string(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  address: z.string(),
  registerType: z.enum([
    "None",
    "Artisan",
    "Business",
    "Institution",
    "BuyerMembership",
    "CorpoMembership",
    "SponsorMembership",
  ]),
  userStatus: z.enum(["Pending", "Actice"]),
  businessStructure: z.string(),
  businessNetwork: z.string(),
  businessWebsite: z.string(),
});

type EditBusinessFormValues = z.infer<typeof EditBusinessSchema>;

type ComponentProps = {
  businessId: string;
};

export const EditBusiness = ({ businessId }: ComponentProps) => {
  const { toast } = useToast();

  const [business] = api.updation.getBusinessById.useSuspenseQuery({
    businessId,
  });

  const updateBusinessMutation =
    api.updation.updateBusinessWithUser.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Business information updated successfully.",
          variant: "default",
          className: "bg-green-50 text-green-800 border-green-300",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description:
            error.message || "Failed to update business information.",
          variant: "destructive",
        });
      },
    });

  const form = useForm<EditBusinessFormValues>({
    resolver: zodResolver(EditBusinessSchema),
    defaultValues: {
      // Business fields
      businessId: "",
      businessName: "",
      businessEmail: "",
      businessAddress: "",
      businessType: "None",
      businessSold: "",
      businessEmployee: 0,
      status: "active",
      listingCriteria: "",
      documents: [],
      businessMarket: "None",
      yearOfOperation: 1,
      businessStructure: "none",
      businessNetwork: "none",
      businessWebsite: "none",

      // User fields
      userId: "",
      fullName: "",
      phone: "",
      email: "",
      address: "",
      registerType: "Business",
      userStatus: "Pending",
    },
  });

  useEffect(() => {
    if (business && business.user) {
      // Explicitly parse and cast enum values to ensure correct type validation
      let parsedBusinessType:
        | "None"
        | "Large_Enterprice"
        | "Mid_sized_Business"
        | "Small_Business"
        | "Startup" = "None";
      if (
        business.businessType === "None" ||
        business.businessType === "Large_Enterprice" ||
        business.businessType === "Mid_sized_Business" ||
        business.businessType === "Small_Business" ||
        business.businessType === "Startup"
      ) {
        parsedBusinessType = business.businessType;
      }

      let parsedMarket: "None" | "Local" | "National" | "International" =
        "None";
      if (
        business.businessMarket === "None" ||
        business.businessMarket === "Local" ||
        business.businessMarket === "National" ||
        business.businessMarket === "International"
      ) {
        parsedMarket = business.businessMarket;
      }

      let parsedRegisterType:
        | "None"
        | "Artisan"
        | "Business"
        | "Institution"
        | "BuyerMembership"
        | "CorpoMembership"
        | "SponsorMembership" = "Business";
      if (
        business.user.registerType === "None" ||
        business.user.registerType === "Artisan" ||
        business.user.registerType === "Business" ||
        business.user.registerType === "Institution" ||
        business.user.registerType === "BuyerMembership" ||
        business.user.registerType === "CorpoMembership" ||
        business.user.registerType === "SponsorMembership"
      ) {
        parsedRegisterType = business.user.registerType;
      }

      let parsedUserStatus: "Pending" | "Actice" = "Pending";
      if (
        business.user.status === "Pending" ||
        business.user.status === "Actice"
      ) {
        parsedUserStatus = business.user.status;
      }

      // Reset form with properly validated values
      form.reset({
        // Business fields
        businessId: business.businessId,
        businessName: business.businessName ?? "none",
        businessEmail: business.businessEmail,
        businessAddress: business.businessAddress ?? "none",
        businessType: parsedBusinessType,
        businessSold: business.businessSold ?? "none",
        businessEmployee: business.businessEmployee ?? 0,
        status: business.status ?? "active",
        listingCriteria: business.listingCriteria,
        documents: business.documents ?? [],
        businessMarket: parsedMarket,
        yearOfOperation: business.yearOfOperation ?? 1,

        // User fields
        userId: business.userId,
        fullName: business.user.fullName ?? "none",
        phone: business.user.phone ?? "none",
        email: business.user.email ?? "none",
        address: business.user.address ?? "none",
        businessStructure: business.businessStructure ?? "none",
        businessNetwork: business.businessNetwork ?? "none",
        businessWebsite: business.businessWebsite ?? "none",
        registerType: parsedRegisterType,
        userStatus: parsedUserStatus,
      });

      // Force an immediate update for select fields
      setTimeout(() => {
        form.setValue("businessType", parsedBusinessType);
        form.setValue("businessMarket", parsedMarket);
        form.setValue("registerType", parsedRegisterType);
        form.setValue("userStatus", parsedUserStatus);
      }, 0);
    }
  }, [business, form]);

  const onSubmit = (data: EditBusinessFormValues) => {
    // Explicitly handle any undefined values before submission
    const formattedData = {
      ...data,
      // Ensure no undefined values are submitted
      businessName: data.businessName || "none",
      businessAddress: data.businessAddress || "none",
      businessSold: data.businessSold || "none",
      phone: data.phone || "none",
      address: data.address || "none",
      documents: data.documents || [],
    };

    updateBusinessMutation.mutate(formattedData);
  };

  if (!business) {
    return null; // Suspense will handle loading state
  }

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle>Edit Business Profile</CardTitle>
        <CardDescription>Update business and user information</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <Tabs defaultValue="business" className="w-full">
              <TabsList className="mb-6 grid grid-cols-2">
                <TabsTrigger value="business">Business Details</TabsTrigger>
                <TabsTrigger value="user">User Information</TabsTrigger>
              </TabsList>

              <TabsContent value="business" className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Business Information</h3>
                  <Separator />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Business name" {...field} />
                        </FormControl>
                        <FormDescription>
                          The name of your business
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Business email"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Official business email address
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Business address"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Physical address of the business
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="businessStructure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Legal Structure</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select legal structure" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="Sole_Proprietorship">
                              Sole Proprietorship
                            </SelectItem>
                            <SelectItem value="Partnership">
                              Partnership
                            </SelectItem>
                            <SelectItem value="Limited_Liability_Partnership">
                              Limited Liability Partnership
                            </SelectItem>
                            <SelectItem value="Private_Limited">
                              Private Limited
                            </SelectItem>
                            <SelectItem value="Public_Limited">
                              Public Limited
                            </SelectItem>
                            <SelectItem value="Cooperative_Society">
                              Cooperative Society
                            </SelectItem>
                            {/* Additional three options */}
                            <SelectItem value="Trust">Trust</SelectItem>
                            <SelectItem value="Nonprofit_Organization">
                              Nonprofit Organization
                            </SelectItem>
                            <SelectItem value="Social_Enterprise">
                              Social Enterprise
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The legal structure of your business
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessNetwork"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Network</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select network type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="Affiliated">
                              Affiliated
                            </SelectItem>
                            <SelectItem value="Subsidiary">
                              Subsidiary
                            </SelectItem>
                            <SelectItem value="Individual">
                              Individual
                            </SelectItem>
                            <SelectItem value="Network">Network</SelectItem>
                            <SelectItem value="Franchise">Franchise</SelectItem>
                            <SelectItem value="Consignment_Partner">
                              Consignment Partner
                            </SelectItem>
                            <SelectItem value="Retail_Partner">
                              Retail Partner
                            </SelectItem>
                            <SelectItem value="Event_Based_Partner">
                              Event-Based Partner
                            </SelectItem>
                            <SelectItem value="Import_Export_Partner">
                              Import-Export Partner
                            </SelectItem>
                            <SelectItem value="Auction_Platform_Member">
                              Auction Platform Member
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The business network or affiliation type
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessWebsite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Website</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter website URL" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your business website URL
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="Large_Enterprice">
                              Large Enterprise
                            </SelectItem>
                            <SelectItem value="Mid_sized_Business">
                              Mid-sized Business
                            </SelectItem>
                            <SelectItem value="Small_Business">
                              Small Business
                            </SelectItem>
                            <SelectItem value="Startup">Startup</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The type/size of your business
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="businessEmployee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Employees</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Number of employees"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Total number of employees
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="yearOfOperation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Operation</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Years in business"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          How long the business has operated
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessSold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Products/Services Sold</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="What your business sells"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Main products or services
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-6 space-y-2">
                  <h3 className="text-lg font-medium">Market & Status</h3>
                  <Separator />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="businessMarket"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Market Reach</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select market scope" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="Local">Local</SelectItem>
                            <SelectItem value="National">National</SelectItem>
                            <SelectItem value="International">
                              International
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The market scope of your business
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            <SelectItem value="blacklist">
                              Blacklisted
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Current status of the business listing
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="user" className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">
                    Owner/Representative Information
                  </h3>
                  <Separator />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Full name of representative"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The business owner or representative&apos;s name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Contact email address"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Personal or contact email address
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contact phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Contact phone number</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personal Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Personal address"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Personal or contact address
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-6 space-y-2">
                  <h3 className="text-lg font-medium">Account Information</h3>
                  <Separator />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="registerType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select registration type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="Artisan">Artisan</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Institution">
                              Institution
                            </SelectItem>
                            <SelectItem value="BuyerMembership">
                              Buyer Membership
                            </SelectItem>
                            <SelectItem value="CorpoMembership">
                              Corporate Membership
                            </SelectItem>
                            <SelectItem value="SponsorMembership">
                              Sponsor Membership
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Type of registration</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="userStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User Account Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select user status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Actice">Active</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Status of the user account
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Hidden fields that need to be passed but not edited */}
            <input type="hidden" {...form.register("businessId")} />
            <input type="hidden" {...form.register("userId")} />
            <input type="hidden" {...form.register("listingCriteria")} />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={updateBusinessMutation.isPending}>
              {updateBusinessMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <SaveIcon className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
