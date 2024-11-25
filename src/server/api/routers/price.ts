import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from 'zod'
import { TRPCClientError } from "@trpc/client";
import axios, { AxiosError } from "axios";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";
import dayjs, { type Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)


type RatePlan = {
    rate: {
        code: string;
    };
}

type BlockDate = {
    blockId: string;
    startDate: string;
    endDate: string;
}

type DateRange = {
    startDate: Dayjs;
    endDate: Dayjs;
}

type ApiJsonDate = {
    from: string;
    to: string;
    rate: Array<{ rateplanid: string }>;
    closed: string;
}

type ApiJson = {
    hotelid: string;
    room: Array<{
        roomid: string;
        date: ApiJsonDate[];
    }>;
}

type SUErrorProps = {
    Errors: Array<{ ShortText: string }>;
}

export const priceRouter = createTRPCRouter({

    getPriceById: protectedProcedure.input(z.object({ priceId: z.string() }))
        .query(async ({ ctx, input }): Promise<PriceProps | null> => {
            try {
                const prices: PriceProps | null = await ctx.db.roomPrice.findUnique({
                    where: { priceId: input.priceId },
                })
                return prices
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    })
                }
                console.error(error)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),

    getPricesWithRateRoomId: protectedProcedure
        .input(z.object({
            rrpId: z.string()
        }))
        .query(async ({ ctx, input }): Promise<FilteredPricesProps> => {
            try {

                const roomRatePlans: FilteredPricesProps | null = await ctx.db.roomRatePlan.findFirst({
                    where: {
                        rrpId: input.rrpId
                    },
                    include: {
                        RoomPrice: {
                            select: {
                                startDate: true,
                                endDate: true,
                                planCode: true,
                                price: true,
                            }
                        }
                    }
                })

                if (!roomRatePlans) throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Not found'
                })

                return roomRatePlans
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    })
                }
                console.error(error)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),

    getAllPrices: protectedProcedure.query(async ({ ctx }) => {
        try {

            const roomRatePlans: RatePriceProps[] = await ctx.db.roomRatePlan.findMany({
                where: {
                    room: {
                        hotel: {
                            accountId: ctx.session.user.id
                        }
                    }
                },
                include: {
                    rate: {
                        select: {
                            ratePlanId: true,
                            name: true,
                            code: true,
                        }
                    },
                    room: {
                        select: {
                            roomId: true,
                            roomName: true,
                            quantity: true
                        }
                    },
                    RoomPrice: {
                        select: {
                            startDate: true,
                            endDate: true,
                            planCode: true,
                            price: true,
                        }

                    }
                }
            })

            const groupedByRoom: Record<string, GroupedRatePriceProps> = {};
            roomRatePlans.forEach(item => {
                const roomId = item.roomId;
                if (!groupedByRoom[roomId]) {
                    groupedByRoom[roomId] = {
                        roomId: item.room.roomId,
                        roomName: item.room.roomName,
                        occupancy: item.occupancy,
                        rates: []
                    };
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { room, ...itemWithoutRoom } = item;
                groupedByRoom[roomId].rates.push(itemWithoutRoom);
            });
            const data = Object.values(groupedByRoom);
            return data
        } catch (error) {
            if (error instanceof TRPCClientError) {
                console.error(error.data)
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: error.message
                })
            }
            console.error(error)
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: "Something went wrong"
            })
        }
    }),

    createPrice: protectedProcedure
        .input(z.object({
            startDate: z.string(),
            endDate: z.string(),
            roomId: z.string(),
            ratePlan: z.string(),
            rateId: z.string(),
            price: z.number(),
            hotelId: z.string(),
            quantity: z.number(),
            minimumstay: z.number(),
            occupancy: z.number()
        }))
        .mutation(async ({ ctx, input }) => {

            try {
                const hotel = await ctx.db.hotel.findUnique({ where: { hotelId: input.hotelId } })
                const roomDetails = await ctx.db.room.findUnique({ where: { roomId: input.roomId } });

                if (!hotel || !roomDetails) throw new TRPCError({ code: "NOT_FOUND", message: "Data not found" })

                // const priceJson = {
                //     "hotelid": hotel.code,
                //     "room": [{
                //         "roomid": roomDetails.code,
                //         "date": [{
                //             "from": input.startDate,
                //             "to": input.endDate,
                //             "rate": [{
                //                 "rateplanid": input.ratePlan
                //             }],
                //             "price": [{
                //                 "NumberOfGuests": input.occupancy,
                //                 "value": input.price
                //             }
                //             ],
                //             "roomstosell": input.quantity,
                //             "closed": "0",
                //             "minimumstay": input.minimumstay,
                //             "maximumstay": 99,
                //             "closedonarrival": "0",
                //             "closedondeparture": "0"
                //         }]
                //     }]
                // }

                // const headers = {
                //     'Content-Type': 'application/json',
                //     'Authorization': `Basic ${env.API_KEY}`,
                //     'app-id': `${env.APP_ID}`
                // }

                // await axios.post(`${env.API_SU}/availability`, priceJson, { headers })

                const roomRatePlan = await ctx.db.roomRatePlan.findFirst({
                    where: {
                        roomId: input.roomId,
                        rateId: input.rateId,
                        occupancy: input.occupancy,
                    }
                })

                const overlappingRecords = await ctx.db.roomPrice.findMany({
                    where: {
                        rrpId: roomRatePlan?.rrpId ?? 'none',
                        OR: [
                            {
                                startDate: { lte: input.endDate },
                                endDate: { gte: input.startDate }
                            }
                        ]
                    }
                });
                let found = false
                let priceId = ''
                for (const overlappingRecord of overlappingRecords) {
                    if (overlappingRecord.startDate === input.startDate && overlappingRecord.endDate === input.endDate) {
                        found = true
                        priceId = overlappingRecord.priceId
                    }
                }

                if (found)
                    await ctx.db.roomPrice.update({
                        where: { priceId: priceId },
                        data: {
                            price: input.price,
                        }
                    });
                else
                    await ctx.db.roomPrice.create({
                        data: {
                            rrpId: roomRatePlan?.rrpId ?? 'none',
                            startDate: input.startDate,
                            endDate: input.endDate,
                            planCode: input.ratePlan,
                            price: input.price,
                        }
                    });


            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    })
                } else if (error instanceof AxiosError) {
                    const suError = error.response?.data as SUErrorProps
                    console.log(suError)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: suError.Errors[0]?.ShortText
                    })
                } else if (error instanceof TRPCError) {
                    console.error(error.message)
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: error.message
                    })
                }
                console.error(error)
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: "Something went wrong"
                })
            }
        }),

    deletePriceById: protectedProcedure.input(z.object({ priceId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.roomPrice.delete({
                    where: {
                        priceId: input.priceId
                    }
                })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    })
                }
                console.error(error)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),

    deletePricesByIds: protectedProcedure
        .input(z.object({ priceIds: z.string().array() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.roomPrice.deleteMany({
                    where: {
                        priceId: {
                            in: input.priceIds
                        }
                    }
                })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    })
                }
                console.error(error)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),

    blockRoomByDate: protectedProcedure
        .input(z.object({ startDate: z.string(), endDate: z.string(), roomId: z.string(), hotelCode: z.string(), roomCode: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                const ratePlans: RatePlan[] = await ctx.db.roomRatePlan.findMany({
                    where: { roomId: input.roomId },
                    select: {
                        rate: { select: { code: true } }
                    }
                });

                if (ratePlans.length == 0) throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Rate plans not found"
                });

                const inputStart = dayjs(input.startDate);
                const inputEnd = dayjs(input.endDate);

                const existingBlocks: BlockDate[] = await ctx.db.blockDate.findMany({
                    where: {
                        roomId: input.roomId,
                        OR: [
                            {
                                startDate: { lte: input.endDate },
                                endDate: { gte: input.startDate }
                            }
                        ]
                    }
                });

                const newBlocks: DateRange[] = [];
                const blocksToRemove: string[] = [];
                const priceJson = [];
                const rateArray = ratePlans.map((rateplan) => ({ "rateplanid": rateplan.rate.code }))

                for (const block of existingBlocks) {
                    const blockStart = dayjs(block.startDate);
                    const blockEnd = dayjs(block.endDate);

                    if (inputStart <= blockEnd && inputEnd >= blockStart) {
                        blocksToRemove.push(block.blockId);
                        priceJson.push({
                            "from": blockStart.format('YYYY-MM-DD'),
                            "to": blockEnd.format('YYYY-MM-DD'),
                            "rate": rateArray,
                            "closed": "0",
                        });
                        if (blockStart < inputStart) {
                            newBlocks.push({ startDate: blockStart, endDate: inputStart.subtract(1, 'day') });
                        }
                        if (blockEnd > inputEnd) {
                            newBlocks.push({ startDate: inputEnd.add(1, 'day'), endDate: blockEnd });
                        }
                    }
                }

                // If no existing blocks overlap, prepare a new block for the input range
                if (blocksToRemove.length === 0) {
                    priceJson.push({
                        "from": input.startDate,
                        "to": input.endDate,
                        "rate": rateArray,
                        "closed": "1",
                    });
                } else {
                    // Add new blocks for the non-overlapping parts
                    for (const block of newBlocks) {
                        priceJson.push({
                            "from": block.startDate.format('YYYY-MM-DD'),
                            "to": block.endDate.format('YYYY-MM-DD'),
                            "rate": rateArray,
                            "closed": "1",
                        });
                    }
                }

                // Prepare API JSON
                const apiJson: ApiJson = {
                    "hotelid": input.hotelCode,
                    "room": [{
                        "roomid": input.roomCode,
                        "date": priceJson
                    }]
                };

                // Send API request first
                // const headers = {
                //     'Content-Type': 'application/json',
                //     'Authorization': `Basic ${env.API_KEY}`,
                //     'app-id': `${env.APP_ID}`
                // };

                // const response = await axios.post(`${env.API_SU}/availability`, apiJson, { headers });
                // If OTA API request is successful, update the database
                if (blocksToRemove.length > 0) {
                    // Remove existing blocks that overlap with the input range
                    await ctx.db.blockDate.deleteMany({
                        where: {
                            blockId: {
                                in: blocksToRemove
                            }
                        }
                    });
                }
                // Add new blocks to the database
                for (const block of newBlocks) {
                    await ctx.db.blockDate.create({
                        data: {
                            startDate: block.startDate.format('YYYY-MM-DD'),
                            endDate: block.endDate.format('YYYY-MM-DD'),
                            roomId: input.roomId
                        }
                    });
                }

                if (blocksToRemove.length === 0) {
                    await ctx.db.blockDate.create({
                        data: {
                            startDate: input.startDate,
                            endDate: input.endDate,
                            roomId: input.roomId
                        }
                    });
                }

            } catch (error) {
                if (error instanceof TRPCError) {
                    console.error(error);
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    });
                } else if (error instanceof TRPCClientError) {
                    console.error(error);
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    });
                } else if (error instanceof AxiosError) {
                    const suError = error.response?.data as SUErrorProps;
                    console.error(suError);
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: suError.Errors[0]?.ShortText
                    });
                }
                console.error(error);
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                });
            }
        }),

    getBlockDatesByRoomIdAndQuantity: protectedProcedure
        .input(z.object({ roomId: z.string(), quantity: z.number() }))
        .query(async ({ ctx, input }) => {
            try {
                const roomData = await ctx.db.room.findUnique({
                    where: { roomId: input.roomId },
                    select: { quantity: true }
                });

                if (!roomData) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: 'Room not found.'
                    });
                }

                // Fetch room bookings
                // const roomBookings = await ctx.db.roomBooking.findMany({
                //     where: {
                //         roomId: input.roomId,
                //         bookingDetails: {
                //             status: {
                //                 not: 'cancelled'
                //             }
                //         }
                //     },
                //     select: { startDate: true, endDate: true, quantity: true }
                // });

                // Fetch existing block dates
                const existingBlockDates = await ctx.db.blockDate.findMany({
                    where: { roomId: input.roomId },
                    select: { startDate: true, endDate: true }
                });

                // Create a map to store the booking quantity for each date
                const dateQuantityMap = new Map<string, number>();
                const blockedDates = new Set<string>()

                for (const block of existingBlockDates) {
                    let currentDate = dayjs(block.startDate);
                    const endDate = dayjs(block.endDate);
                    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
                        blockedDates.add(currentDate.format('YYYY-MM-DD'));
                        currentDate = currentDate.add(1, 'day');
                    }
                }

                // for (const booking of roomBookings) {
                //     if (booking.startDate && booking.endDate && booking.quantity) {
                //         let currentDate = dayjs(booking.startDate);
                //         const endDate = dayjs(booking.endDate);

                //         while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
                //             const dateString = currentDate.format('YYYY-MM-DD');
                //             const newQuantity = (dateQuantityMap.get(dateString) ?? 0) + booking.quantity;

                //             // If adding the booking quantity will exceed available rooms, mark the date as blocked
                //             if ((roomData.quantity - newQuantity) < input.quantity) 
                //                 blockedDates.add(dateString);
                
                //             // Update the map with the new quantity for the date
                //             dateQuantityMap.set(dateString, newQuantity);
                //             currentDate = currentDate.add(1, 'day');
                //         }
                //     }
                // }

                // Merge consecutive blocked dates into ranges
                const mergedBlockDates: { startDate: string; endDate: string }[] = [];
                let currentRange: { startDate: string; endDate: string } | null = null;

                for (const date of blockedDates) {
                    if (!currentRange) {
                        currentRange = { startDate: date, endDate: date };
                    } else if (dayjs(date).diff(dayjs(currentRange.endDate), 'day') === 1) {
                        currentRange.endDate = date; // Extend the range if the dates are consecutive
                    } else {
                        mergedBlockDates.push(currentRange);
                        currentRange = { startDate: date, endDate: date };
                    }
                }

                if (currentRange) 
                    mergedBlockDates.push(currentRange);
                
                return mergedBlockDates;
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    })
                }
                console.error(error)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),

    getBlockDatesByRoomId: protectedProcedure
        .input(z.object({ roomId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                const roomsWithBlockDates = await ctx.db.blockDate.findMany({
                    where: {
                        roomId: input.roomId,
                    },
                    select: {
                        startDate: true,
                        endDate: true,
                    }
                });

                return roomsWithBlockDates;
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    })
                }
                console.error(error)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),

    getBlockDates: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                const roomsWithBlockDates = await ctx.db.room.findMany({
                    where: {
                        hotel: {
                            accountId: ctx.session.user.id
                        }
                    },
                    select: {
                        roomId: true,
                        BlockDate: {
                            select: {
                                startDate: true,
                                endDate: true
                            }
                        }
                    }
                });

                const result = roomsWithBlockDates.map(room => ({
                    roomId: room.roomId,
                    blockDates: room.BlockDate.map(date => ({
                        startDate: date.startDate,
                        endDate: date.endDate
                    }))
                }));

                return result;
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    })
                }
                console.error(error)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),
})
