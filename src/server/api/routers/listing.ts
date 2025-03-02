import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { type SkillLevel, type MarketType, type BusinessLevel, type InstitutionType, ListingRanks } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { randomUUID } from "crypto";

export const lisitingRouter = createTRPCRouter({


    getArtisanDetail: protectedProcedure
        .input(z.object({ artisanId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                return await ctx.db.artisan.findUnique({
                    where: {
                        artisanId: input.artisanId,
                    },
                    include: {
                        user: true,
                        criteria: true,
                    },
                });

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

    getBusinessDetail: protectedProcedure
        .input(z.object({ businessId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                return await ctx.db.business.findUnique({
                    where: {
                        businessId: input.businessId,
                    },
                    include: {
                        user: true,
                        criteria: true,
                    },
                });

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

    getInstituteDetail: protectedProcedure
        .input(z.object({ instituteId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                return await ctx.db.institute.findUnique({
                    where: {
                        instituteId: input.instituteId,
                    },
                    include: {
                        user: true,
                        criteria: true,
                    },
                });

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

    getUser: protectedProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                return await ctx.db.user.findUnique({
                    where: { userId: input.userId },
                    select: {
                        fullName: true,
                        phone: true,
                        email: true,
                        address: true,
                    },
                });
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

    updateUser: protectedProcedure
        .input(z.object({
            userId: z.string(),
            fullName: z.string(),
            phone: z.string(),
            email: z.string().email(),
            address: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.user.update({
                    where: { userId: input.userId },
                    data: {
                        fullName: input.fullName,
                        phone: input.phone,
                        email: input.email,
                        address: input.address,
                    },
                });
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

    addListing: publicProcedure
        .input(z.object({
            registerType: z.enum(["Artisan", "Business", "Institution"]),
            rank: z.enum(["Gold", "Silver", "Bronze"]),
            // Artisan fields
            craftSpecialty: z.string().optional(),
            craftSkill: z.enum(["Expert", "Advanced", "Beginner"]).optional(),
            craftExperience: z.number().optional(),
            market: z.enum(["Local", "National", "International"]).optional(),
            award: z.string().optional(),
            // Business fields
            businessName: z.string().optional(),
            businessType: z.enum(["Large_Enterprice", "Mid_sized_Business", "Small_Business", "Startup"]).optional(),
            yearOfOperation: z.number().optional(),
            // Institution fields
            instituteName: z.string().optional(),
            instituteType: z.enum(["Governance", "NGO", "Training_Body", "Educational_Body"]).optional(),
            instituteMission: z.string().optional(),
            instituteAddress: z.string().optional()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                // 1. Create dummy user
                const dummyUser = await ctx.db.user.create({
                    data: {
                        fullName: `Dummy ${input.registerType}`,
                        email: `dummy.${randomUUID().toString()}@example.com`,
                        phone: "1234567890",
                        address: "123 Dummy Street",
                        password: "dummy123",
                        registerType: input.registerType,
                    },
                });

                // 2. Create listing criteria
                const listingCriteria = await ctx.db.lisitingCritera.create({
                    data: {
                        sourceOfMaterial: "Local sourcing",
                        craftingProcess: "Traditional",
                        sustainablePractices: true,
                        sustainabledescription: "Uses eco-friendly materials",
                        fairWage: true,
                        genderSuport: true,
                        womenPercentage: 50,
                        workplaceuphold: true,
                        workplaceDescription: "Safe working conditions",
                        childLabour: false,
                        fairTrade: true,
                        fairtradeDoc: ["doc1.pdf"],
                        giHold: true,
                        giNumber: "GI123456",
                        giDoc: "gi-cert.pdf",
                        blockChain: true,
                        blockChainDoc: ["block1.pdf"],
                        ethics: true,
                        qualityReview: true,
                        profilePermission: true,
                        complianceAcknowledgement: true,
                        listingRank: input.rank as ListingRanks
                    },
                });

                // 3. Create type-specific record
                if (input.registerType === "Artisan") {
                    await ctx.db.artisan.create({
                        data: {
                            userId: dummyUser.userId,
                            craftSpecialty: input.craftSpecialty ?? "General Crafts",
                            craftSkill: input.craftSkill as SkillLevel,
                            craftExperience: input.craftExperience ?? 0,
                            craftAward: input.award,
                            market: input.market as MarketType,
                            documents: [],
                            listingCriteria: listingCriteria.criteraId,
                        },
                    });
                }

                else if (input.registerType === "Business") {
                    await ctx.db.business.create({
                        data: {
                            userId: dummyUser.userId,
                            businessName: input.businessName ?? "Dummy Business",
                            businessEmail: `${input.businessName}@business.com`,
                            businessAddress: "123 Business St",
                            businessType: input.businessType as BusinessLevel,
                            businessSold: "Various Items",
                            yearOfOperation: input.yearOfOperation ?? 1,
                            businessEmployee: 0,
                            documents: [],
                            businessMarket: input.market as MarketType,
                            listingCriteria: listingCriteria.criteraId,
                        },
                    });
                }

                else if (input.registerType === "Institution") {
                    await ctx.db.institute.create({
                        data: {
                            userId: dummyUser.userId,
                            instituteName: input.instituteName ?? "Dummy Institution",
                            instituteEmail: `${input.instituteName}@institute.com`,
                            instituteAddress: input.instituteAddress,
                            instituteRep: "John Doe",
                            repDes: "Representative",
                            instituteType: input.instituteType as InstitutionType,
                            instituteMission: input.instituteMission ?? "General Mission",
                            documents: [],
                            listingCriteria: listingCriteria.criteraId,
                        },
                    });
                }

                return {
                    success: true,
                    user: dummyUser,
                    message: "Listing created successfully"
                };

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

    deleteArtisan: protectedProcedure
        .input(z.object({ artisanId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                // First, delete the artisan record
                await ctx.db.artisan.deleteMany({
                    where: {
                        artisanId: input.artisanId,
                    },
                });

                // Then, delete the associated user record
                await ctx.db.user.deleteMany({
                    where: {
                        Artisan: {
                            some: {
                                artisanId: input.artisanId
                            }
                        }
                    },
                });

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

    deleteBusiness: protectedProcedure
        .input(z.object({ businessId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                // First, delete the artisan record
                await ctx.db.business.deleteMany({
                    where: {
                        businessId: input.businessId,
                    },
                });

                // Then, delete the associated user record
                await ctx.db.user.deleteMany({
                    where: {
                        Business: {
                            some: {
                                businessId: input.businessId
                            }
                        }
                    },
                });

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

    deleteInstitute: protectedProcedure
        .input(z.object({ instituteId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                // First, delete the artisan record
                await ctx.db.institute.deleteMany({
                    where: {
                        instituteId: input.instituteId,
                    },
                });

                // Then, delete the associated user record
                await ctx.db.user.deleteMany({
                    where: {
                        Institute: {
                            some: {
                                instituteId: input.instituteId
                            }
                        }
                    },
                });
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

    blackListArtisan: protectedProcedure
        .input(z.object({ artisanId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.artisan.update({
                    where: {
                        artisanId: input.artisanId,
                    },
                    data: {
                        status: 'blacklist'
                    }
                });
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

    blackListBusiness: protectedProcedure
        .input(z.object({ businessId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.business.update({
                    where: {
                        businessId: input.businessId,
                    },
                    data: {
                        status: 'blacklist'
                    }
                });
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

    blackListInstitute: protectedProcedure
        .input(z.object({ instituteId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.institute.update({
                    where: {
                        instituteId: input.instituteId,
                    },
                    data: {
                        status: 'blacklist'
                    }
                });
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
