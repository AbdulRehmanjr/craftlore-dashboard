"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "~/hooks/use-toast";

const formSchema = z.object({
  registerType: z.enum(["Artisan", "Business", "Institution"]),
  rank: z.enum(["Gold", "Silver", "Bronze"]),
  // Artisan fields
  craftSpecialty: z
    .string()
    .min(2, "Craft specialty must be at least 2 characters")
    .optional(),
  craftSkill: z.enum(["Expert", "Advanced", "Beginner"]).optional(),
  craftExperience: z.number().min(0).optional(),
  market: z.enum(["Local", "National", "International"]).optional(),
  award: z.string().optional(),
  // Business fields
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .optional(),
  businessType: z
    .enum([
      "Large_Enterprice",
      "Mid_sized_Business",
      "Small_Business",
      "Startup",
    ])
    .optional(),
  yearOfOperation: z.number().min(1, "Years must be at least 1").optional(),
  // Institution fields
  instituteName: z
    .string()
    .min(2, "Institution name must be at least 2 characters")
    .optional(),
  instituteAddress: z
    .string()
    .min(2, "Institution name must be at least 2 characters")
    .optional(),
  instituteType: z
    .enum(["Governance", "NGO", "Training_Body", "Educational_Body"])
    .optional(),
  instituteMission: z
    .string()
    .min(10, "Mission must be at least 10 characters")
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const AddListingDialog = () => {
  const utils = api.useUtils();
  const [open, setOpen] = useState(false);

  const addListing = api.listing.addListing.useMutation({
    onSuccess: async () => {
      setOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Listing created successfully",
      });
      await utils.listing.getArtisans.refetch();
      await utils.listing.getBusinesses.refetch();
      await utils.listing.getInstitutes.refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      registerType: "Artisan",
      rank: "Bronze",
    },
  });

  const registerType = form.watch("registerType");

  const onSubmit = (values: FormValues) => {
    addListing.mutate({
      registerType: values.registerType,
      rank: values.rank,
      ...(values.registerType === "Artisan" && {
        craftSpecialty: values.craftSpecialty,
        craftSkill: values.craftSkill,
        craftExperience: values.craftExperience,
        market: values.market,
        award: values.award,
      }),
      ...(values.registerType === "Business" && {
        businessName: values.businessName,
        businessType: values.businessType,
        yearOfOperation: values.yearOfOperation,
        market: values.market,
      }),
      ...(values.registerType === "Institution" && {
        instituteName: values.instituteName,
        instituteType: values.instituteType,
        instituteMission: values.instituteMission,
        instituteAddress: values.instituteAddress,
      }),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add New Listing</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Listing</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Register Type Field */}
            <FormField
              control={form.control}
              name="registerType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Artisan">Artisan</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Institution">Institution</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rank Field */}
            <FormField
              control={form.control}
              name="rank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rank</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rank" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Bronze">Bronze</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Artisan Fields */}
            {registerType === "Artisan" && (
              <>
                <FormField
                  control={form.control}
                  name="craftSpecialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Craft Specialty</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="award"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Award</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
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
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select skill level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Expert">Expert</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="craftExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience (years)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="market"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Market</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select market" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Local">Local</SelectItem>
                          <SelectItem value="National">National</SelectItem>
                          <SelectItem value="International">
                            International
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Business Fields */}
            {registerType === "Business" && (
              <>
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
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
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="market"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Market</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select market" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Local">Local</SelectItem>
                          <SelectItem value="National">National</SelectItem>
                          <SelectItem value="International">
                            International
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Institution Fields */}
            {registerType === "Institution" && (
              <>
                <FormField
                  control={form.control}
                  name="instituteName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Name</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instituteAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Address</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instituteType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select institution type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Governance">Governance</SelectItem>
                          <SelectItem value="NGO">NGO</SelectItem>
                          <SelectItem value="Training_Body">
                            Training Body
                          </SelectItem>
                          <SelectItem value="Educational_Body">
                            Educational Body
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instituteMission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Mission</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={addListing.isPending}>
                {addListing.isPending ? "Adding..." : "Add Listing"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
