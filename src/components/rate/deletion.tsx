import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

type DeleteRateProps = {
    rateId: string
    rateCode: string;
    hotelCode: string;
};

export const DeleteRatePlan = ({ rateId, rateCode, hotelCode }: DeleteRateProps) => {
    const { toast } = useToast();
    const utils = api.useUtils();
    const deleteRooms = api.rateplan.deleteRatePlan.useMutation({
        onSuccess: async () => {
            toast({
                title: "Success!",
                description: "Rate plan deleted successfully.",
            });
            await utils.rateplan.getRatePlanBySellerId.invalidate();
        },
        onError: (data) => {
            toast({
                variant: "destructive",
                title: "Oop!",
                description: data.message,
            });
        },
    });

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="destructive"
                    className="w-full h-full"
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
                        onClick={() => deleteRooms.mutate({ rateCode: rateCode, hotelCode: hotelCode, rateId: rateId })}
                        disabled={deleteRooms.isPending}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
