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
const EditInstituteSchema = z.object({
  // Institute model fields
  instituteId: z.string(),
  instituteName: z.string().min(1, { message: "Institute name is required" }),
  instituteEmail: z.string().email({ message: "Please enter a valid email address" }),
  instituteType: z.enum(["None", "Governance", "NGO", "Training_Body", "Educational_Body"]),
  instituteAddress: z.string(),
  instituteMission: z.string(),
  instituteRep: z.string(),
  repDes: z.string(),
  status: z.string(),
  listingCriteria: z.string(),
  documents: z.array(z.string()),
  
  // User model fields
  userId: z.string(),
  fullName: z.string().min(1, { message: "Full name is required" }),
  phone: z.string(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  address: z.string(),
  registerType: z.enum(["None", "Artisan", "Business", "Institution", "BuyerMembership", "CorpoMembership", "SponsorMembership"]),
  userStatus: z.enum(["Pending", "Actice"]),
});

type EditInstituteFormValues = z.infer<typeof EditInstituteSchema>;

type ComponentProps = {
  instituteId: string;
};

export const EditInstitute = ({ instituteId }: ComponentProps) => {
  const { toast } = useToast();

  // Use Suspense-enabled query
  const [institute] = api.updation.getInstituteById.useSuspenseQuery({ instituteId });

  const updateInstituteMutation = api.updation.updateInstituteWithUser.useMutation({
    onSuccess: () => {
      
      toast({
        title: "Success",
        description: "Institute information updated successfully.",
        variant: "default",
        className: "bg-green-50 text-green-800 border-green-300",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update institute information.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<EditInstituteFormValues>({
    resolver: zodResolver(EditInstituteSchema),
    defaultValues: {
      // Institute fields
      instituteId: "",
      instituteName: "",
      instituteEmail: "",
      instituteType: "None",
      instituteAddress: "",
      instituteMission: "",
      instituteRep: "",
      repDes: "",
      status: "active",
      listingCriteria: "",
      documents: [],
      
      // User fields
      userId: "",
      fullName: "",
      phone: "",
      email: "",
      address: "",
      registerType: "Institution",
      userStatus: "Pending",
    },
  });

  useEffect(() => {
    if (institute && institute.user) {
      // Explicitly parse and cast enum values to ensure correct type validation
      let parsedInstituteType: "None" | "Governance" | "NGO" | "Training_Body" | "Educational_Body" = "None";
      if (institute.instituteType === "None" || institute.instituteType === "Governance" || 
          institute.instituteType === "NGO" || institute.instituteType === "Training_Body" || 
          institute.instituteType === "Educational_Body") {
        parsedInstituteType = institute.instituteType;
      }
      
      let parsedRegisterType: "None" | "Artisan" | "Business" | "Institution" | 
        "BuyerMembership" | "CorpoMembership" | "SponsorMembership" = "Institution";
      if (institute.user.registerType === "None" || institute.user.registerType === "Artisan" || 
          institute.user.registerType === "Business" || institute.user.registerType === "Institution" ||
          institute.user.registerType === "BuyerMembership" || institute.user.registerType === "CorpoMembership" ||
          institute.user.registerType === "SponsorMembership") {
        parsedRegisterType = institute.user.registerType;
      }
      
      let parsedUserStatus: "Pending" | "Actice" = "Pending";
      if (institute.user.status === "Pending" || institute.user.status === "Actice") {
        parsedUserStatus = institute.user.status;
      }
      
      // Reset form with properly validated values
      form.reset({
        // Institute fields
        instituteId: institute.instituteId,
        instituteName: institute.instituteName ?? "none",
        instituteEmail: institute.instituteEmail,
        instituteType: parsedInstituteType,
        instituteAddress: institute.instituteAddress ?? "none",
        instituteMission: institute.instituteMission ?? "none",
        instituteRep: institute.instituteRep ?? "none",
        repDes: institute.repDes ?? "none",
        status: institute.status ?? "active",
        listingCriteria: institute.listingCriteria,
        documents: institute.documents ?? [],
        
        // User fields
        userId: institute.userId,
        fullName: institute.user.fullName ?? "none",
        phone: institute.user.phone ?? "none",
        email: institute.user.email ?? "none",
        address: institute.user.address ?? "none",
        registerType: parsedRegisterType,
        userStatus: parsedUserStatus,
      });
      
      // Force an immediate update for select fields
      setTimeout(() => {
        form.setValue("instituteType", parsedInstituteType);
        form.setValue("registerType", parsedRegisterType);
        form.setValue("userStatus", parsedUserStatus);
      }, 0);
    }
  }, [institute, form]);

  const onSubmit = (data: EditInstituteFormValues) => {
    // Explicitly handle any undefined values before submission
    const formattedData = {
      ...data,
      // Ensure no undefined values are submitted
      instituteName: data.instituteName || "none",
      instituteAddress: data.instituteAddress || "none",
      instituteMission: data.instituteMission || "none",
      instituteRep: data.instituteRep || "none",
      repDes: data.repDes || "none",
      phone: data.phone || "none",
      address: data.address || "none",
      documents: data.documents || [],
    };
    
    updateInstituteMutation.mutate(formattedData);
  };

  if (!institute) {
    return null; // Suspense will handle loading state
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Institute Profile</CardTitle>
        <CardDescription>
          Update institute and user information
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <Tabs defaultValue="institute" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="institute">Institute Details</TabsTrigger>
                <TabsTrigger value="user">User Information</TabsTrigger>
              </TabsList>
              
              <TabsContent value="institute" className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <Separator />
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="instituteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institute Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Institute name" {...field} />
                        </FormControl>
                        <FormDescription>
                          The name of your institution
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instituteEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institute Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Institute email" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Official institute email address
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instituteType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institute Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select institute type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="Governance">Governance</SelectItem>
                            <SelectItem value="NGO">NGO</SelectItem>
                            <SelectItem value="Training_Body">Training Body</SelectItem>
                            <SelectItem value="Educational_Body">Educational Body</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The type of your institution
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instituteAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institute Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Institute address" 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Physical address of the institution
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2 mt-6">
                  <h3 className="text-lg font-medium">Mission & Representative</h3>
                  <Separator />
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="instituteMission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mission Statement</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the mission of your institution" 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          The main mission and goals of your institution
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="instituteRep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Representative Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Name of representative"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Official representative of the institution
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="repDes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Representative Designation</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Position/Title of representative"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Position or title of the representative
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-2 mt-6">
                  <h3 className="text-lg font-medium">Status</h3>
                  <Separator />
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institute Status</FormLabel>
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
                          Current status of the institute listing
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="user" className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">User Information</h3>
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
                          <Input placeholder="Full name of user" {...field} />
                        </FormControl>
                        <FormDescription>
                          Name of the user account owner
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
            
            {/* Hidden fields that need to be passed but not edited */}
            <input type="hidden" {...form.register("instituteId")} />
            <input type="hidden" {...form.register("userId")} />
            <input type="hidden" {...form.register("listingCriteria")} />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={updateInstituteMutation.isPending}>
              {updateInstituteMutation.isPending ? (
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