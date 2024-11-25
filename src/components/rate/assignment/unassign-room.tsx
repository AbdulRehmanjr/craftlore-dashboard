'use client'

import {AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,AlertDialogTrigger,} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

export const UnAssignRoom = ({ roomId, rateId }: { roomId: string, rateId: string }) => {

    const { toast } = useToast();
    const deleteRatePlan = api.rateplan.deleteRoomRatePlan.useMutation({
        onSuccess: () => {
            toast({
                title: "Success!",
                description: "Rate plan deleted successfully.",
            });
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Oop!",
                description: "Something went wrong.",
            });
        },
    })

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="destructive"
                    className="h-full"
                    onClick={(event) => event.stopPropagation()}
                >
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete
                        information and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() =>
                            deleteRatePlan.mutate({
                                roomId: roomId,
                                rateId: rateId,
                            })
                        }
                        disabled={deleteRatePlan.isPending}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
