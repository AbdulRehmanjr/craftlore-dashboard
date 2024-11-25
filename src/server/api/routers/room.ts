import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from 'zod'
import { TRPCClientError } from "@trpc/client";
import { env } from "~/env";
import axios, { AxiosError } from "axios";
import { TRPCError } from "@trpc/server";
import { randomCode } from "~/lib/utils";

export const roomRouter = createTRPCRouter({

    getRoomById: protectedProcedure.input(z.object({ roomId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                const room: RoomProps | null = await ctx.db.room.findUnique({
                    where: {
                        roomId: input.roomId
                    }
                })
                if (!room) throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Room not found"
                })
                return room
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    })
                }
                else if (error instanceof TRPCError) {
                    console.error(error)
                    throw new TRPCError({
                        code: error.code,
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

    getAllRoomsBySellerId: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                const rooms: RoomTableProps[] = await ctx.db.room.findMany({
                    where: {
                        hotel: {
                            accountId: ctx.session.user.id
                        }
                    },
                    include: { hotel: true }
                })
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

    createRoom: protectedProcedure
        .input(z.object({
            roomName: z.string(),
            description: z.string(),
            beds: z.number(),
            capacity: z.number(),
            price: z.number(),
            area: z.number(),
            roomType: z.string(),
            features: z.string().array(),
            images: z.string().array(),
            hotelId: z.string(),
            quantity: z.number(),
            minimiumstay: z.number()
        }))
        .mutation(async ({ ctx, input }) => {

            try {
                const hotel = await ctx.db.hotel.findUnique({ where: { hotelId: input.hotelId } })
                if (!hotel) throw new TRPCError({
                    code: "NOT_FOUND",
                    message: 'Hotel not found.'
                })
                const roomCode = randomCode(6, 'R')
                // const headers = {
                //     'Content-Type': 'application/json',
                //     'Authorization': `Basic ${env.API_KEY}`,
                //     'app-id': `${env.APP_ID}`
                // }
                // const roomJson = {
                //     "SellableProducts": {
                //         "hotelid": `${hotel.code}`,
                //         "SellableProduct": [
                //             {
                //                 "InvStatusType": "Initial",
                //                 "GuestRoom": {
                //                     "Occupancy": {
                //                         "MaxOccupancy": `${input.capacity}`,
                //                         "MaxChildOccupancy": `${input.capacity}`,
                //                     },
                //                     "Room": {
                //                         "roomid": roomCode,
                //                         "RoomRate": `${input.price}`,
                //                         "Quantity": `${input.quantity}`,
                //                         "RoomType": `${input.roomType}`,
                //                         "SizeMeasurement": `${input.capacity}`,
                //                         "SizeMeasurementUnit": "sqm"
                //                     },
                //                     "Facilities": {
                //                         "Facility": input.features.map((feature) => (
                //                             {
                //                                 "Group": "Amenities",
                //                                 "name": `${feature}`
                //                             }
                //                         ))
                //                     },
                //                     "Description": {
                //                         "Text": input.roomName,
                //                         "RoomDescription": input.description
                //                     }

                //                 }
                //             }
                //         ]
                //     }
                // }

                // await axios.post(`${env.API_SU}/OTA_HotelRoom`, roomJson, { headers })
                await ctx.db.room.create({
                    data: {
                        roomName: input.roomName,
                        description: input.description,
                        area: input.area,
                        beds: input.beds,
                        capacity: input.capacity,
                        price: input.price,
                        code: roomCode,
                        features: input.features,
                        pictures: input.images,
                        roomType: input.roomType,
                        quantity: input.quantity,
                        hotelId: input.hotelId,
                        minimumstay: input.minimiumstay,
                        dp: input.images[0]
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

    editRoom: protectedProcedure
        .input(z.object({
            roomId: z.string(),
            roomName: z.string(),
            description: z.string(),
            beds: z.number(),
            price: z.number(),
            capacity: z.number(),
            features: z.string().array(),
            dp: z.string(),
            area: z.number(),
            roomType: z.string(),
            quantity: z.number(),
            images: z.string().array(),
            hotelId: z.string(),
            minimiumstay: z.number(),
            code: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            try {

                const hotel = await ctx.db.hotel.findUnique({ where: { hotelId: input.hotelId } })
                if (!hotel) throw new TRPCError({
                    code: "NOT_FOUND",
                    message: 'Hotel not found.'
                })
                // const headers = {
                //     'Content-Type': 'application/json',
                //     'Authorization': `Basic ${env.API_KEY}`,
                //     'app-id': `${env.APP_ID}`
                // }
                // const roomJson = {
                //     "SellableProducts": {
                //         "hotelid": hotel.code,
                //         "SellableProduct": [
                //             {
                //                 "InvNotifType": "Overlay",
                //                 "InvStatusType": "Modify",
                //                 "roomid": input.code,
                //                 "GuestRoom": {
                //                     "Occupancy": {
                //                         "MaxOccupancy": input.capacity,
                //                         "MaxChildOccupancy": input.capacity,
                //                     },
                //                     "Room": {
                //                         "RoomRate": input.price,
                //                         "Quantity": input.quantity,
                //                         "RoomType": input.roomType,
                //                         "SizeMeasurement": input.capacity,
                //                         "SizeMeasurementUnit": "sqm"
                //                     },
                //                     "Facilities": {
                //                         "Facility": input.features.map((feature) => (
                //                             {
                //                                 "Group": "Amenities",
                //                                 "name": feature
                //                             }
                //                         ))
                //                     },
                //                     "Description": {
                //                         "Text": input.roomName,
                //                         "RoomDescription": input.description
                //                     }
                //                 }
                //             }
                //         ]
                //     }
                // }

                // await axios.post(`${env.API_SU}/OTA_HotelRoom`, roomJson, { headers })
                await ctx.db.room.update({
                    where: { roomId: input.roomId },
                    data: {
                        roomName: input.roomName,
                        description: input.description,
                        area: input.area,
                        beds: input.beds,
                        price: input.price,
                        features: input.features,
                        dp: input.dp,
                        capacity: input.capacity,
                        roomType: input.roomType,
                        quantity: input.quantity,
                        pictures: input.images,
                        minimumstay: input.minimiumstay
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

    toggleRoomStatus: protectedProcedure
        .input(z.object({
            roomId: z.string(),
            hotelCode: z.string(),
            roomCode: z.string(),
            status: z.boolean()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                // const headers = {
                //     'Content-Type': 'application/json',
                //     'Authorization': `Basic ${env.API_KEY}`,
                //     'app-id': `${env.APP_ID}`
                // }
                // const roomJson = {
                //     "SellableProducts": {
                //         "hotelid": `${input.hotelCode}`,
                //         "SellableProduct": [{
                //             "InvNotifType": "Overlay",
                //             "InvStatusType": input.status ? 'Deactivated' : "Active",
                //             "roomid": `${input.roomCode}`
                //         }]
                //     }
                // }

                // await axios.post(`${env.API_SU}/OTA_HotelRoom`, roomJson, { headers })
                await ctx.db.room.update({
                    where: {
                        roomId: input.roomId
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

    deleteRoomById: protectedProcedure
        .input(z.object({
            roomId: z.string(),
            roomCode: z.string(),
            hotelCode: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                // const headers = {
                //     'Content-Type': 'application/json',
                //     'Authorization': `Basic ${env.API_KEY}`,
                //     'app-id': `${env.APP_ID}`
                // }

                // const roomJson = {
                //     "SellableProducts": {
                //         "hotelid": `${input.hotelCode}`,
                //         "SellableProduct": [{
                //             "InvNotifType": "Overlay",
                //             "InvStatusType": "Delete",
                //             "roomid": `${input.roomCode}`
                //         }]
                //     }
                // }

                // await axios.post(`${env.API_SU}/OTA_HotelRoom`, roomJson, { headers })
                await ctx.db.room.delete({ where: { roomId: input.roomId } })

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

})

