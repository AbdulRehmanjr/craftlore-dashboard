"use client";

import { Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";


export const CarbonCategoryDelete = ({
  categoryId,
}: {
  categoryId: string;
}) => {
  const utils = api.useUtils();
  const { toast } = useToast();
  const deleteCategory = api.category.deleteCategory.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: "Category deleted successfully.",
      });
         await utils.category.getCategories.invalidate();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Oop!",
        description: error.message,
      });
    },
  });

  const onClick = () => {
    deleteCategory.mutate({ categoryId: categoryId });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" >
            <Trash/> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-red-600">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" type="button">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild><Button type="button" variant="destructive" onClick={onClick}>Confirm</Button></AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
