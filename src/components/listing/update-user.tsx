"use client";

import { useEffect, useState } from "react";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const userFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email"),
  address: z.string().min(5, "Please enter a valid address"),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UpdateUserDialogProps {
  userId: string;
  dialog: string;
}

export const UpdateUserDialog = ({ userId, dialog }: UpdateUserDialogProps) => {
  const utils = api.useUtils();
  const [open, setOpen] = useState(false);

  const { data: userData } = api.listing.getUser.useQuery(
    { userId },
    {
      enabled: open,
    },
  );

  const updateUser = api.listing.updateUser.useMutation({
    onSuccess: async () => {
      setOpen(false);
      if (dialog == "artisan") await utils.listing.getArtisans.refetch();
      else if (dialog == "business")
        await utils.listing.getBusinesses.refetch();
      else await utils.listing.getInstitutes.refetch();
    },
  });

  // Form initialization
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      fullName: userData?.fullName ?? "",
      phone: userData?.phone ?? "",
      email: userData?.email ?? "",
      address: userData?.address ?? "",
    },
  });

  // Update form values when userData changes
  useEffect(() => {
    if (userData) {
      form.reset({
        fullName: userData.fullName,
        phone: userData.phone,
        email: userData.email,
        address: userData.address,
      });
    }
  }, [userData, form]);

  const onSubmit = (values: UserFormValues) => {
    updateUser.mutate({
      userId,
      ...values,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-full w-full">
          Update
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update User Information</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
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
                    <Input {...field} type="email" />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateUser.isPending}>
                {updateUser.isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
