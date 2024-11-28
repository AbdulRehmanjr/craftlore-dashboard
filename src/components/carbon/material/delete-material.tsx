"use client";

import { Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";


export const CarbonMaterialDelete = ({
  materialId,
  subId
}: {
  materialId: string;
  subId:string
}) => {
  const utils = api.useUtils();
  const { toast } = useToast();
  const deleteMaterial = api.carbon.deleteMaterial.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: "Material deleted successfully.",
      });
         await utils.carbon.getAllMaterials.invalidate({subId:subId});
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
    deleteMaterial.mutate({ materialId: materialId });
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
