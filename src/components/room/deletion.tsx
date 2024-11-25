
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

type RoomData = {
    roomId: string;
    roomCode: string;
    hotelCode: string;
}

export const DeleteRoomPopups = ({ roomId, roomCode, hotelCode }: RoomData) => {
    const utils = api.useUtils();
    const { toast } = useToast();

    const deleteRoom = api.room.deleteRoomById.useMutation({
        onSuccess: async () => {
            toast({
                title: "Success!",
                description: "Room deleted successfully.",
            });
            await utils.room.getAllRoomsBySellerId.invalidate();
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
                <Button variant="destructive" className="w-full" onClick={(event) => event.stopPropagation()}>
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
                        onClick={() => deleteRoom.mutate({ roomId: roomId, roomCode: roomCode, hotelCode: hotelCode })}
                        disabled={deleteRoom.isPending}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
