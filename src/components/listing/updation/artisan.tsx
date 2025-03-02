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
const EditArtisanSchema = z.object({
  // Artisan model fields
  artisanId: z.string(),
  craftSpecialty: z.string().min(1, { message: "Craft specialty is required" }),
  craftSkill: z.enum(["None", "Beginner", "Advanced", "Expert"]),
  craftExperience: z.coerce.number().min(0).max(100),
  craftAward: z.string(), // Make non-optional
  market: z.enum(["None", "Local", "National", "International"]),
  status: z.string(),
  listingCriteria: z.string(),
  documents: z.array(z.string()),
  
  // User model fields
  userId: z.string(),
  fullName: z.string().min(1, { message: "Full name is required" }),
  phone: z.string(), // Make non-optional
  email: z.string().email({ message: "Please enter a valid email address" }),
  address: z.string(), // Make non-optional
  registerType: z.enum(["None", "Artisan", "Business", "Institution", "BuyerMembership", "CorpoMembership", "SponsorMembership"]),
  userStatus: z.enum(["Pending", "Actice"]),
});

type EditArtisanFormValues = z.infer<typeof EditArtisanSchema>;

type ComponentProps = {
  artisanId: string;
};

export const EditArtisan = ({ artisanId }: ComponentProps) => {
  const { toast } = useToast();

  const utils = api.useUtils()
  // Use Suspense-enabled query
  const [artisan] = api.updation.getArtisanById.useSuspenseQuery({ artisanId });

  const updateArtisanMutation = api.updation.updateArtisanWithUser.useMutation({
    onSuccess: () => {
      // Refetch data and show success message
      void utils.listing.getArtisans.refetch();
      toast({
        title: "Success",
        description: "Artisan information updated successfully.",
        variant: "default",
        className: "bg-green-50 text-green-800 border-green-300",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update artisan information.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<EditArtisanFormValues>({
    resolver: zodResolver(EditArtisanSchema),
    defaultValues: {
      // Artisan fields with non-optional strings
      artisanId: "",
      craftSpecialty: "",
      craftSkill: "None",
      craftExperience: 0,
      craftAward: "",
      market: "None",
      status: "active",
      listingCriteria: "",
      documents: [],
      
      // User fields with non-optional strings
      userId: "",
      fullName: "",
      phone: "",
      email: "",
      address: "",
      registerType: "Artisan",
      userStatus: "Pending",
    },
  });

  useEffect(() => {
    if (artisan && artisan.user) {
      // Explicitly parse and cast enum values to ensure correct type validation
      let parsedCraftSkill: "None" | "Beginner" | "Advanced" | "Expert" = "None";
      if (artisan.craftSkill === "None" || artisan.craftSkill === "Beginner" || 
          artisan.craftSkill === "Advanced" || artisan.craftSkill === "Expert") {
        parsedCraftSkill = artisan.craftSkill;
      }
      
      let parsedMarket: "None" | "Local" | "National" | "International" = "None";
      if (artisan.market === "None" || artisan.market === "Local" || 
          artisan.market === "National" || artisan.market === "International") {
        parsedMarket = artisan.market;
      }
      
      let parsedRegisterType: "None" | "Artisan" | "Business" | "Institution" | 
        "BuyerMembership" | "CorpoMembership" | "SponsorMembership" = "Artisan";
      if (artisan.user.registerType === "None" || artisan.user.registerType === "Artisan" || 
          artisan.user.registerType === "Business" || artisan.user.registerType === "Institution" ||
          artisan.user.registerType === "BuyerMembership" || artisan.user.registerType === "CorpoMembership" ||
          artisan.user.registerType === "SponsorMembership") {
        parsedRegisterType = artisan.user.registerType;
      }
      
      let parsedUserStatus: "Pending" | "Actice" = "Pending";
      if (artisan.user.status === "Pending" || artisan.user.status === "Actice") {
        parsedUserStatus = artisan.user.status;
      }
      
      // Reset form with properly validated values
      form.reset({
        // Artisan fields
        artisanId: artisan.artisanId,
        craftSpecialty: artisan.craftSpecialty ?? "none",
        craftSkill: parsedCraftSkill,
        craftExperience: artisan.craftExperience ?? 0,
        craftAward: artisan.craftAward ?? "none",
        market: parsedMarket,
        status: artisan.status ?? "active",
        listingCriteria: artisan.listingCriteria,
        documents: artisan.documents ?? [],
        
        // User fields
        userId: artisan.userId,
        fullName: artisan.user.fullName ?? "none",
        phone: artisan.user.phone ?? "none",
        email: artisan.user.email ?? "none",
        address: artisan.user.address ?? "none",
        registerType: parsedRegisterType,
        userStatus: parsedUserStatus,
      });
      
      // Force an immediate update for select fields
      setTimeout(() => {
        form.setValue("craftSkill", parsedCraftSkill);
        form.setValue("market", parsedMarket);
        form.setValue("registerType", parsedRegisterType);
        form.setValue("userStatus", parsedUserStatus);
      }, 0);
    }
  }, [artisan, form]);

  const onSubmit = (data: EditArtisanFormValues) => {
    // Explicitly handle any undefined values before submission
    const formattedData = {
      ...data,
      // Ensure no undefined values are submitted
      phone: data.phone || "none",
      address: data.address || "none",
      craftAward: data.craftAward || "none",
      documents: data.documents || [],
    };
    
    updateArtisanMutation.mutate(formattedData);
  };

  if (!artisan) {
    return null; // Suspense will handle loading state
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Artisan Profile</CardTitle>
        <CardDescription>
          Update artisan and user information
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <Tabs defaultValue="artisan" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="artisan">Artisan Details</TabsTrigger>
                <TabsTrigger value="user">User Information</TabsTrigger>
              </TabsList>
              
              <TabsContent value="artisan" className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Craft Information</h3>
                  <Separator />
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="craftSpecialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Craft Specialty</FormLabel>
                        <FormControl>
                          <Input placeholder="Craft specialty" {...field} />
                        </FormControl>
                        <FormDescription>
                          The artisan&apos;s primary craft specialty
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="craftSkill"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skill Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select skill level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                            <SelectItem value="Expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The artisan&apos;s skill level
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="craftExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience (Years)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Years of experience"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Years of experience in craft
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="craftAward"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Craft Award</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Awards or recognitions (optional)"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Any awards or recognitions received
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-2 mt-6">
                  <h3 className="text-lg font-medium">Market & Status</h3>
                  <Separator />
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="market"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Market</FormLabel>
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
                            <SelectItem value="International">International</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The market scope for the artisan&apos;s work
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
                        <FormLabel>Artisan Status</FormLabel>
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
                            <SelectItem value="blacklist">Blacklisted</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Current status of the artisan listing
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="user" className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Personal Information</h3>
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
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormDescription>
                          The artisan&apos;s full name
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Email address" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Contact email address
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
                            placeholder="Phone number" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Contact phone number
                        </FormDescription>
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
                          <Textarea 
                            placeholder="Full address" 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Physical address 
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-2 mt-6">
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
                            <SelectItem value="Institution">Institution</SelectItem>
                            <SelectItem value="BuyerMembership">Buyer Membership</SelectItem>
                            <SelectItem value="CorpoMembership">Corporate Membership</SelectItem>
                            <SelectItem value="SponsorMembership">Sponsor Membership</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Type of registration
                        </FormDescription>
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
          
            <input type="hidden" {...form.register("artisanId")} />
            <input type="hidden" {...form.register("userId")} />
            <input type="hidden" {...form.register("listingCriteria")} />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={updateArtisanMutation.isPending}>
              {updateArtisanMutation.isPending ? (
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