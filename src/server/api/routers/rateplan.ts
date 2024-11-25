import { createTRPCRouter, protectedProcedure } from "../trpc";
import { env } from "~/env";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { TRPCClientError } from "@trpc/client";
import { randomCode } from "~/lib/utils";


export const ratePlanRouter = createTRPCRouter({

    getRateById: protectedProcedure
        .input(z.object({ rateId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                const data: RatePlanProps | null = await ctx.db.ratePlan.findUnique({
                    where: { ratePlanId: input.rateId }
                })
                if (!data) throw new TRPCError({
                    code: "NOT_FOUND",
                    message: 'Rate plan not found'
                })
                return data
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
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
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),

    getRoomRatePlanByRoomId: protectedProcedure
        .input(z.object({ roomId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {

                const data = await ctx.db.roomRatePlan.findMany({
                    where: { roomId: input.roomId },
                    include: {
                        room : {
                            select : {quantity:true}
                        },
                        rate: {
                            select: {
                                ratePlanId: true,
                                code: true,
                                name: true,
                            }
                        }
                    }
                })
                if (!data) throw new TRPCError({
                    code: "NOT_FOUND",
                    message: 'Rate plan not found'
                })
                return data
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
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
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),

    getRatePlanBySellerId: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                const rates: RatePlanDetailProps[] = await ctx.db.ratePlan.findMany({
                    where: {
                        hotel: {
                            accountId: ctx.session.user.id
                        }
                    },
                    include: {
                        hotel: {
                            select: {
                                hotelId: true,
                                hotelName: true,
                                code: true,
                                accountId: true
                            }
                        }
                    }
                })
                return rates
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
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
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),

    createRatePlan: protectedProcedure
        .input(z.object({
            rateName: z.string(),
            description: z.string(),
            hotelId: z.string(),
            mealId: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            try {

                const hotel = await ctx.db.hotel.findUnique({ where: { hotelId: input.hotelId } })
                if (!hotel) throw new TRPCError({
                    code: "NOT_FOUND",
                    message: 'Hotel not found.'
                })

                const rateplanid = randomCode(4, 'RA')
                // const headers = {
                //     'Content-Type': 'application/json',
                //     'Authorization': `Basic ${env.API_KEY}`,
                //     'app-id': `${env.APP_ID}`
                // }
                // const rateJson = {
                //     "RatePlans": {
                //         "hotelid": hotel.code,
                //         "RatePlan": [{
                //             "RatePlanNotifType": "New",
                //             "rateplanid": rateplanid,
                //             "MealPlanID": input.mealId,
                //             "Description": {
                //                 "Name": input.rateName,
                //                 "Text": input.description
                //             }
                //         }
                //         ]
                //     }
                // }

                // await axios.post(`${env.API_SU}/OTA_HotelRatePlan`, rateJson, { headers })
                await ctx.db.ratePlan.create({
                    data: {
                        name: input.rateName,
                        description: input.description,
                        code: rateplanid,
                        mealId: +input.mealId,
                        hotelId: input.hotelId,
                    }
                })

            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    })
                } else if (error instanceof AxiosError) {
                    const suError = error.response?.data as SUErrorProps
                    console.error(suError)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: suError.Errors[0]?.ShortText
                    })
                }
                console.error(error)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),

    updateRatePlan: protectedProcedure
        .input(z.object({
            rateId: z.string(),
            rateName: z.string(),
            code: z.string(),
            description: z.string(),
            hotelId: z.string(),
            mealId: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            try {

                const hotel = await ctx.db.hotel.findUnique({
                    where: { hotelId: input.hotelId },
                    select: {
                        code: true
                    }
                })

                if (!hotel) throw new TRPCError({
                    code: "NOT_FOUND",
                    message: 'Hotel not found.'
                })

                // const headers = {
                //     'Content-Type': 'application/json',
                //     'Authorization': `Basic ${env.API_KEY}`,
                //     'app-id': `${env.APP_ID}`
                // }

                // const rateJson = {
                //     "RatePlans": {
                //         "hotelid": hotel.code,
                //         "RatePlan": [{
                //             "RatePlanNotifType": "Overlay",
                //             "rateplanid": input.code,
                //             "MealPlanID": input.mealId,
                //             "Description": {
                //                 "Name": input.rateName,
                //                 "Text": input.description
                //             }
                //         }
                //         ]
                //     }
                // }

                // await axios.post(`${env.API_SU}/OTA_HotelRatePlan`, rateJson, { headers })

                await ctx.db.ratePlan.update({
                    where: { ratePlanId: input.rateId },
                    data: {
                        name: input.rateName,
                        description: input.description,
                        mealId: +input.mealId,
                        hotelId: input.hotelId,
                    }
                })

            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    })
                } else if (error instanceof AxiosError) {
                    const suError = error.response?.data as SUErrorProps
                    console.error(suError)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: suError.Errors[0]?.ShortText
                    })
                }
                console.error(error)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),

    toggleRateStatus: protectedProcedure
        .input(z.object({
            rateId: z.string(),
            hotelCode: z.string(),
            rateCode: z.string(),
            status: z.boolean()
        }))
        .mutation(async ({ ctx, input }) => {
            try {

                // const headers = {
                //     'Content-Type': 'application/json',
                //     'Authorization': `Basic ${env.API_KEY}`,
                //     'app-id': `${env.APP_ID}`
                // }
                // const ratePlanJson = {
                //     "RatePlans": {
                //         "hotelid": input.hotelCode,
                //         "RatePlan": [{
                //             "RatePlanNotifType": input.status ? 'Remove' : "Activate",
                //             "rateplanid": input.rateCode
                //         }]
                //     }
                // }

                // await axios.post(`${env.API_SU}/OTA_HotelRatePlan`, ratePlanJson, { headers })
                await ctx.db.ratePlan.update({
                    where: {
                        ratePlanId: input.rateId
                    },
                    data: {
                        isActive: !input.status
                    }
                })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
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
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),

    deleteRatePlan: protectedProcedure
        .input(z.object({ rateCode: z.string(), hotelCode: z.string(), rateId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {

                // const headers = {
                //     'Content-Type': 'application/json',
                //     'Authorization': `Basic ${env.API_KEY}`,
                //     'app-id': `${env.APP_ID}`
                // }

                // const rateJson = {
                //     "RatePlans": {
                //         "hotelid": input.hotelCode,
                //         "RatePlan": [{
                //             "RatePlanNotifType": "Delete",
                //             "rateplanid": input.rateCode
                //         }]
                //     }
                // }

                // await axios.post(`${env.API_SU}/OTA_HotelRatePlan`, rateJson, { headers })
                await ctx.db.roomRatePlan.deleteMany({ where: { rateId: input.rateId } })
                await ctx.db.ratePlan.delete({
                    where: { ratePlanId: input.rateId }
                })

            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    })
                } else if (error instanceof AxiosError) {
                    const suError = error.response?.data as SUErrorProps
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: suError.Errors[0]?.ShortText
                    })
                }
                console.error(error)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),

    getAllAssignedRoomsByRateId: protectedProcedure
        .input(z.object({ rateId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                const assignedRooms = await ctx.db.roomRatePlan.findMany({
                    where: { rateId: input.rateId },
                    select: {
                        rateId: true,
                        roomId: true,
                        occupancy:true,
                        room: {
                            select: {
                                roomId: true,
                                roomName: true
                            }
                        }
                    }
                });
                return assignedRooms
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
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

    getAllRoomsByRateId: protectedProcedure
        .input(z.object({ rateId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                const rooms = await ctx.db.room.findMany({
                    where: {
                        hotel: {
                            RatePlan: {
                                every: {
                                    ratePlanId: input.rateId
                                }
                            }
                        },
                    },
                    select: {
                        roomId: true,
                        roomName: true,
                        quantity: true,
                        hotelId: true,
                        hotel: {
                            select: {
                                hotelName: true
                            }
                        }
                    }
                });

                return rooms
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
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
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),

    createRoomRatePlan: protectedProcedure
        .input(z.object({
            rateId: z.string(),
            roomId: z.string(),
            occupancy: z.number(),
            hotelName: z.string(),
            hotelId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            try {

                await ctx.db.roomRatePlan.create({
                    data: {
                        rateId: input.rateId,
                        roomId: input.roomId,
                        occupancy: input.occupancy,
                        hotelName: input.hotelName,
                        hotelId: input.hotelId,
                    }
                })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
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
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),

    deleteRoomRatePlan: protectedProcedure
        .input(z.object({
            rateId: z.string(),
            roomId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            try {

                await ctx.db.roomRatePlan.delete({
                    where: {
                        roomId_rateId_occupancy: {
                            roomId: input.roomId,
                            rateId: input.rateId,
                            occupancy:0,
                        },
                    },
                });


            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
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
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),

})