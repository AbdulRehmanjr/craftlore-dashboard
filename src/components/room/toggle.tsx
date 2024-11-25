import { RefreshCcw } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { useToast } from "~/hooks/use-toast";

import { api } from "~/trpc/react";

type DialogProps = {
    roomId: string
    hotelCode: string
    roomCode: string
    status: boolean
}
export const RoomStatusToggle = ({ roomId, hotelCode, status, roomCode }: DialogProps) => {

    const { toast } = useToast()
    const utils = api.useUtils()
    const toggleStatus = api.room.toggleRoomStatus.useMutation({
        onSuccess: async () => {
            toast({
                title: "Success!",
                description: "Room status changes",
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

    const confirmToggle = () => {
        toggleStatus.mutate({ roomCode: roomCode, hotelCode: hotelCode, roomId: roomId, status: status });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={(event) => { event.stopPropagation() }}
                >
                    Toggle status
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle >Toogle room status</DialogTitle>
                    <DialogDescription >
                        You are going to change the status of room.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant={"outline"}>
                            Close
                        </Button>
                    </DialogClose>
                    <Button
                        type="button"
                        onClick={confirmToggle}
                        disabled={toggleStatus.isPending}
                    >
                        {toggleStatus.isPending ? (
                            <>
                                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </>
                        ) : (
                            "Confirm"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
