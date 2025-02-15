"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";

interface DeleteDialogProps {
  businessId: string;
}

export const DeleteBusinessDialog = ({
  businessId,
}: DeleteDialogProps) => {
  const utils = api.useUtils();
  const { toast } = useToast();
  const [open, setOpen] = useState<boolean>(false);

  const deleteBusiness = api.listing.deleteBusiness.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Business has been deleted successfully",
      });
      setOpen(false);
      await utils.listing.getBusinesses.refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = async () => {
    deleteBusiness.mutate({ businessId });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="h-full w-full">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            artisan and remove their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteBusiness.isPending}
            >
              {deleteBusiness.isPending ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
