
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from 'zod'
import { TRPCClientError } from "@trpc/client";

import { env } from "~/env";
import axios, { AxiosError } from "axios";
import { TRPCError } from "@trpc/server";
import { randomCode } from "~/lib/utils";


export const hotelRouter = createTRPCRouter({

    createHotel: protectedProcedure
        .input(z.object({
            hotelName: z.string(),
            island: z.string(),
            hotelType: z.string(),
            address: z.string(),
            longitude: z.number(),
            latitude: z.number(),
            description: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            email: z.string(),
            phone: z.string(),
            checkIn: z.string(),
            checkOut: z.string(),
            hotelLogo: z.string(),
            features: z.string().array(),
            images: z.string().array(),
            boards: z.string().array(),
            budget: z.number(),
            rooms: z.number(),
            occupancy: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                const hotelCode = randomCode(6, 'H')
                // const headers = {
                //     'Content-Type': 'application/json',
                //     'Authorization': `Basic ${env.API_KEY}`,
                //     'app-id': `${env.APP_ID}`
                // }
                // const hotelJson = {
                //     "HotelDescriptiveContents": {
                //         "HotelDescriptiveContent": {
                //             "HotelName": input.hotelName,
                //             "HotelType": input.hotelType,
                //             "TimeZone": "Asia/Dubai",
                //             "Plateform": "SU",
                //             "hotelid": hotelCode,
                //             "ChainID": `${env.CHAIN_ID}`,
                //             "LanguageCode": "en",
                //             "CurrencyCode": "EUR",
                //             "Closeoutdays": "1",
                //             "Closeouttime": input.checkOut,
                //             "HotelDescriptiveContentNotifType": "New",
                //             "OfficialCheckinTime": input.checkIn,
                //             "ContactInfos": {
                //                 "ContactInfo": [
                //                     {
                //                         "ContactProfileType": "PhysicalLocation",
                //                         "Addresses": {
                //                             "Address": {
                //                                 "AddressLine": input.address,
                //                                 "CityName": input.island,
                //                                 "PostalCode": "00000",
                //                                 "CountryName": "SE"
                //                             }
                //                         }
                //                     },
                //                     {
                //                         "ContactProfileType": "availability",
                //                         "Names": {
                //                             "Name": {
                //                                 "GivenName": input.firstName,
                //                                 "Surname": input.lastName
                //                             }
                //                         },
                //                         "Addresses": {
                //                             "Address": {
                //                                 "AddressLine": input.address,
                //                                 "CityName": input.island,
                //                                 "PostalCode": "00000",
                //                                 "CountryName": "SE"
                //                             }
                //                         },
                //                         "NotificationEmail": input.email,
                //                         "Emails": {
                //                             "Email": [
                //                                 input.email,
                //                             ]
                //                         },
                //                         "Phones": {
                //                             "Phone": [
                //                                 {
                //                                     "PhoneNumber": input.phone,
                //                                     "PhoneTechType": "5"
                //                                 },

                //                             ]
                //                         }
                //                     }
                //                 ]
                //             },
                //             "HotelInfo": {
                //                 "Position": {
                //                     "Latitude": input.latitude,
                //                     "Longitude": input.longitude
                //                 }
                //             },
                //             "HotelDescription": input.description
                //         }
                //     }
                // }
                // await axios.post(`${env.API_SU}/OTA_HotelDescriptiveContentNotif`, hotelJson, { headers })
                await ctx.db.hotel.create({
                    data: {
                        hotelName: input.hotelName,
                        island: input.island,
                        hotelType: +input.hotelType,
                        address: input.address,
                        longitude: input.longitude,
                        latitude: input.latitude,
                        description: input.description,
                        firstName: input.firstName,
                        lastName: input.lastName,
                        email: input.email,
                        phone: input.phone,
                        checkIn: input.checkIn,
                        checkOut: input.checkOut,
                        code: hotelCode,
                        hotelLogo: input.hotelLogo,
                        features: input.features,
                        boards: input.boards,
                        images: input.images,
                        budget: input.budget,
                        rooms: input.rooms,
                        occupancy: input.occupancy,
                        accountId: ctx.session.user.id
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

    getAllHotelBySellerId: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                const hotels: HotelProps[] = await ctx.db.hotel.findMany({
                    where: { accountId: ctx.session.user.id }
                })
                return hotels
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

    getHotelById: protectedProcedure.input(z.object({ hotelId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                const hotel: HotelProps | null = await ctx.db.hotel.findUnique({
                    where: {
                        hotelId: input.hotelId
                    }
                })
                if (!hotel) throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Hotel not found'
                })
                return hotel
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

    updateHotelInfoById: protectedProcedure
        .input(z.object({
            hotelId: z.string(),
            hotelCode:z.string(),
            hotelName: z.string(),
            island: z.string(),
            hotelType: z.string(),
            address: z.string(),
            longitude: z.number(),
            latitude: z.number(),
            description: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            email: z.string(),
            phone: z.string(),
            checkIn: z.string(),
            checkOut: z.string(),
            hotelLogo: z.string(),
            features: z.string().array(),
            images: z.string().array(),
            boards: z.string().array(),
            budget: z.number(),
            rooms: z.number(),
            occupancy: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                // const headers = {
                //     'Content-Type': 'application/json',
                //     'Authorization': `Basic ${env.API_KEY}`,
                //     'app-id': `${env.APP_ID}`
                // }
                // const hotelJson = {
                //     "HotelDescriptiveContents": {
                //         "HotelDescriptiveContent": {
                //             "HotelName": input.hotelName,
                //             "HotelType": input.hotelType,
                //             "TimeZone": "Asia/Dubai",
                //             "Plateform": "SU",
                //             "hotelid": input.hotelCode,
                //             "ChainID": `${env.CHAIN_ID}`,
                //             "LanguageCode": "en",
                //             "CurrencyCode": "EUR",
                //             "Closeouttime": input.checkOut,
                //             "HotelDescriptiveContentNotifType": "Overlay",
                //             "OfficialCheckinTime": input.checkIn,
                //             "ContactInfos": {
                //                 "ContactInfo": [
                //                     {
                //                         "ContactProfileType": "PhysicalLocation",
                //                         "Addresses": {
                //                             "Address": {
                //                                 "AddressLine": input.address,
                //                                 "CityName": input.island,
                //                                 "PostalCode": "00000",
                //                                 "CountryName": "SE"
                //                             }
                //                         }
                //                     },
                //                     {
                //                         "ContactProfileType": "availability",
                //                         "Names": {
                //                             "Name": {
                //                                 "GivenName": input.firstName,
                //                                 "Surname": input.lastName
                //                             }
                //                         },
                //                         "Addresses": {
                //                             "Address": {
                //                                 "AddressLine": input.address,
                //                                 "CityName": input.island,
                //                                 "PostalCode": "00000",
                //                                 "CountryName": "SE"
                //                             }
                //                         },
                //                         "NotificationEmail": input.email,
                //                         "Emails": {
                //                             "Email": [
                //                                 input.email,
                //                             ]
                //                         },
                //                         "Phones": {
                //                             "Phone": [
                //                                 {
                //                                     "PhoneNumber": input.phone,
                //                                     "PhoneTechType": "5"
                //                                 },

                //                             ]
                //                         }
                //                     }
                //                 ]
                //             },
                //             "HotelInfo": {
                //                 "Position": {
                //                     "Latitude": input.latitude,
                //                     "Longitude": input.longitude
                //                 }
                //             },
                //             "HotelDescription": input.description
                //         }
                //     }
                // }

                // await axios.post(`${env.API_SU}/OTA_HotelDescriptiveContentNotif`, hotelJson, { headers })
                await ctx.db.hotel.update({
                    where: { hotelId: input.hotelId },
                    data: {
                        hotelName: input.hotelName,
                        island: input.island,
                        hotelType: +input.hotelType,
                        address: input.address,
                        longitude: input.longitude,
                        latitude: input.latitude,
                        description: input.description,
                        firstName: input.firstName,
                        lastName: input.lastName,
                        email: input.email,
                        phone: input.phone,
                        checkIn: input.checkIn,
                        checkOut: input.checkOut,
                        hotelLogo: input.hotelLogo,
                        features: input.features,
                        boards: input.boards,
                        images: input.images,
                        budget: input.budget,
                        rooms: input.rooms,
                        occupancy: input.occupancy,
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
                }
                console.error(error)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),

    deleteHotelById: protectedProcedure.input(z.object({ hotelId: z.string(), hotelCode: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {

                // const headers = {
                //     'Content-Type': 'application/json',
                //     'Authorization': `Basic ${env.API_KEY}`,
                //     'app-id': `${env.APP_ID}`
                // }
                // const hotelJson = {
                //     "hotelid": input.hotelCode
                // }

                // await axios.post(`${env.API_SU}/RemoveProperty`, hotelJson, { headers })

                // await ctx.db.ratePlan.deleteMany({
                //     where: {
                //         hotelId: input.hotelId
                //     }
                // })
                await ctx.db.hotel.delete({ where: { hotelId: input.hotelId } })

            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    })
                }
                else if (error instanceof AxiosError) {
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

    deleteHotelByIds: protectedProcedure.input(z.object({ hotelIds: z.string().array() }))
        .mutation(async ({ ctx, input }) => {
            try {

                await ctx.db.hotel.deleteMany({ where: { hotelId: { in: input.hotelIds } } })

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
        })

})