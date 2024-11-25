import { api } from "~/trpc/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { User } from "lucide-react";
import { UnAssignRoom } from "~/components/rate/assignment/unassign-room";

export const AssignedRoomList = async ({ rateId }: { rateId: string }) => {

    const assignedRooms = await api.rateplan.getAllAssignedRoomsByRateId({ rateId: rateId });

    return (
        <Card className="w-full shadow-md">
            <CardHeader className="text-primary">
                <CardTitle className="text-2xl">Assigned Rooms</CardTitle>
                <CardDescription>
                    All assigned rooms.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {
                    assignedRooms.length == 0 ?
                        <div className="w-full">
                            <strong className="text-2xl text-red-600">
                                No room assigned yet to rateplan
                            </strong>
                        </div> :
                        <menu className="flex flex-col gap-4">
                            {assignedRooms.map((data, index) => (
                                <div
                                    className="flex items-center justify-between rounded-lg border border-gray-300 bg-white p-4 shadow-sm"
                                    key={index}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium text-gray-900">{data.room.roomName}</p>
                                            <p className="flex items-center text-xs text-gray-500">
                                                <User className="mr-1 h-4 w-4 text-gray-400" />
                                                Occupancy: {data.occupancy}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <UnAssignRoom rateId={data.rateId} roomId={data.roomId} />
                                    </div>
                                </div>

                            ))}
                        </menu>
                }
            </CardContent>
        </Card>
    );
};
