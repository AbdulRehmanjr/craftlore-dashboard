"use client";

import { Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
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

export const SubSectionDeletion = ({
  subId,
}: {
  subId: string;
}) => {
  const utils = api.useUtils();
  const { toast } = useToast();
  const deleteSub = api.craft.deleteSubSection.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: "Section deleted successfully.",
      });
      await utils.craft.getSectionsBySubCategory.invalidate({
        subCategoryId: subId,
      });
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
    deleteSub.mutate({ subId: subId });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" type="button">
          <Trash />
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
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button type="button" variant="destructive" onClick={onClick}>
              Confirm
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
