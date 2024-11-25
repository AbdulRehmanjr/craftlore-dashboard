import { RefreshCcw } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "~/components/ui/dialog";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

export const DeleteEmployeeDialog = ({ employeeId}: { employeeId: string}) => {
    const { toast } = useToast();
    const utils = api.useUtils();
    const deleteInfo = api.employ.deleteEmployee.useMutation({
        onSuccess: async () => {
            toast({
                title: "Success!",
                description: "Employee deleted successfully.",
            });
            await utils.employ.getEmployees.invalidate();
        },
        onError: (data) => {
            toast({
                variant: "destructive",
                title: "Oop!",
                description: data.message,
            });
        },
    });

    

    const confirmDelete = () => {
        deleteInfo.mutate({ employeeId: employeeId });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="destructive"
                    onClick={(event) => event.stopPropagation()}
                    className="w-full h-full"
                >
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-red-600">Delete Information</DialogTitle>
                    <DialogDescription className="text-gray-950">
                        This action will delete the information.
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
                        variant={"destructive"}
                        onClick={confirmDelete}
                        disabled={deleteInfo.isPending}
                    >
                        {deleteInfo.isPending ? (
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
