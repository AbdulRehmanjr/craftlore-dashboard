import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ListingRanks } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const lisitingRouter = createTRPCRouter({

    getArtisans: publicProcedure
        .query(async ({ ctx }) => {
            try {

                const artisans: ArtisanProps[] = await ctx.db.artisan.findMany({
                    include: {
                        user: {
                            select: {
                                fullName: true,
                                address: true,
                            }
                        }
                    }
                })
                return artisans
            } catch (error) {
                if (error instanceof TRPCError) {
                    console.error(error.message);
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: error.message,
                    });
                }

                console.error(error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Something went wrong.",
                });
            }
        }),

    getTopArtisans: publicProcedure
        .query(async ({ ctx }) => {
            try {

                const goldArtisans = ctx.db.artisan.findMany({
                    take: 3, // Limit to 3 Gold artisans
                    where: {
                        criteria: {
                            AND: [
                                { listingRank: ListingRanks.Gold }
                            ]
                        },
                    },
                    include: {
                        user: {
                            select: {
                                fullName: true,
                                address: true,
                            },
                        },
                    },
                });

                const silverArtisans = ctx.db.artisan.findMany({
                    take: 3, // Limit to 3 Silver artisans
                    where: {
                        criteria: {
                            AND: [
                                { listingRank: ListingRanks.Silver }
                            ]
                        },
                    },
                    include: {
                        user: {
                            select: {
                                fullName: true,
                                address: true,
                            },
                        },
                    
                    },
                });

                const bronzeArtisans = ctx.db.artisan.findMany({
                    take: 3,
                    where: {
                        criteria: {
                            AND: [
                                { listingRank: ListingRanks.Bronze }
                            ]
                        },
                    },
                    include: {
                        user: {
                            select: {
                                fullName: true,
                                address: true,
                            },
                        },
                    
                    },
                });

                // Combine results
                const artisans = await Promise.all([goldArtisans, silverArtisans, bronzeArtisans]);
                const combinedArtisans = {
                    gold: artisans[0],
                    silver: artisans[1],
                    bronze: artisans[2],
                }

                return combinedArtisans;

            } catch (error) {
                if (error instanceof TRPCError) {
                    console.error(error.message);
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: error.message,
                    });
                }

                console.error(error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Something went wrong.",
                });
            }
        }),

    getBusinesses: publicProcedure
        .query(async ({ ctx }) => {
            try {

                const businesses: BusinessProps[] = await ctx.db.business.findMany({
                })
                return businesses
            } catch (error) {
                if (error instanceof TRPCError) {
                    console.error(error.message);
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: error.message,
                    });
                }

                console.error(error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Something went wrong.",
                });
            }
        }),

    getTopBusiness: publicProcedure
        .query(async ({ ctx }) => {
            try {

                const gold = ctx.db.business.findMany({
                    take: 3, // Limit to 3 Gold artisans
                    where: {
                        criteria: {
                            AND: [
                                { listingRank: ListingRanks.Gold }
                            ]
                        },
                    },
                    include: {
                        user: {
                            select: {
                                fullName: true,
                                address: true,
                            },
                        },
                    
                    },
                });

                const silver = ctx.db.business.findMany({
                    take: 3, // Limit to 3 Silver artisans
                    where: {
                        criteria: {
                            AND: [
                                { listingRank: ListingRanks.Silver }
                            ]
                        },
                    },
                    include: {
                        user: {
                            select: {
                                fullName: true,
                                address: true,
                            },
                        },
                    
                    },
                });

                const bronze = ctx.db.business.findMany({
                    take: 3,
                    where: {
                        criteria: {
                            AND: [
                                { listingRank: ListingRanks.Bronze }
                            ]
                        },
                    },
                    include: {
                        user: {
                            select: {
                                fullName: true,
                                address: true,
                            },
                        },
                    
                    },
                });

                // Combine results
                const businesses = await Promise.all([gold, silver, bronze]);
                const combinesBusinesses = {
                    gold: businesses[0],
                    silver: businesses[1],
                    bronze: businesses[2],
                }

                return combinesBusinesses;
            } catch (error) {
                if (error instanceof TRPCError) {
                    console.error(error.message);
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: error.message,
                    });
                }

                console.error(error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Something went wrong.",
                });
            }
        }),

    getInstitutes: publicProcedure
        .query(async ({ ctx }) => {
            try {
                const institutes: InstituteProps[] = await ctx.db.institute.findMany({
                })
                return institutes
            } catch (error) {
                if (error instanceof TRPCError) {
                    console.error(error.message);
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: error.message,
                    });
                }

                console.error(error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Something went wrong.",
                });
            }
        }),

    getTopInstitutes: publicProcedure
        .query(async ({ ctx }) => {
            try {


                const gold = ctx.db.institute.findMany({
                    take: 3, // Limit to 3 Gold artisans
                    where: {
                        criteria: {
                            AND: [
                                { listingRank: ListingRanks.Gold }
                            ]
                        },
                    },
                    include: {
                        user: {
                            select: {
                                fullName: true,
                                address: true,
                            },
                        },
                    
                    },
                });

                const silver = ctx.db.institute.findMany({
                    take: 3, // Limit to 3 Silver artisans
                    where: {
                        criteria: {
                            AND: [
                                { listingRank: ListingRanks.Silver }
                            ]

                        },
                    },
                    include: {
                        user: {
                            select: {
                                fullName: true,
                                address: true,
                            },
                        },
                    
                    },
                });

                const bronze = ctx.db.institute.findMany({
                    take: 3,
                    where: {
                        criteria: {
                            AND: [
                                { listingRank: ListingRanks.Bronze }
                            ]
                        },
                    },
                    include: {
                        user: {
                            select: {
                                fullName: true,
                                address: true,
                            },
                        },
                    
                    },
                });

                // Combine results
                const institutes = await Promise.all([gold, silver, bronze]);
                const combinedInstitutes = {
                    gold: institutes[0],
                    silver: institutes[1],
                    bronze: institutes[2],
                }

                return combinedInstitutes;
            } catch (error) {
                if (error instanceof TRPCError) {
                    console.error(error.message);
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: error.message,
                    });
                }

                console.error(error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Something went wrong.",
                });
            }
        }),

});
