import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const membershipRouter = createTRPCRouter({
    // Get all buyer memberships with user data
    getBuyerMemberships: protectedProcedure.query(async ({ ctx }) => {
        try {
            const buyerMemberships = await ctx.db.buyerMembership.findMany({
                include: {
                    user: {
                        select: {
                            userId: true,
                            fullName: true,
                            email: true,
                            phone: true,
                            address: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return buyerMemberships;
        } catch (error) {
            if (error instanceof TRPCError) {
                console.error(error.message);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: error.message,
                });
            }
            else if (error instanceof TRPCClientError) {
                console.error(error.message)
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'database connection timeout'
                })
            }
            console.error(error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong.",
            });
        }
    }),

    // Get a single buyer membership by ID
    getBuyerMembershipById: protectedProcedure
        .input(z.object({ buyerId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                const buyerMembership = await ctx.db.buyerMembership.findUnique({
                    where: { buyerMemberId: input.buyerId },
                    include: {
                        user: {
                            select: {
                                userId: true,
                                fullName: true,
                                email: true,
                                phone: true,
                                address: true,
                            },
                        },
                    },
                });

                if (!buyerMembership) {
                    throw new Error("Buyer membership not found");
                }

                return buyerMembership;
            } catch (error) {
                if (error instanceof TRPCError) {
                    console.error(error.message);
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: error.message,
                    });
                }
                else if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'database connection timeout'
                    })
                }
                console.error(error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Something went wrong.",
                });
            }
        }),

    getCorpoMemberships: protectedProcedure.query(async ({ ctx }) => {
        try {
            const corpoMemberships = await ctx.db.corpoMembership.findMany({
                include: {
                    user: {
                        select: {
                            userId: true,
                            fullName: true,
                            email: true,
                            phone: true,
                            address: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return corpoMemberships;
        } catch (error) {
            if (error instanceof TRPCError) {
                console.error(error.message);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: error.message,
                });
            }
            else if (error instanceof TRPCClientError) {
                console.error(error.message)
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'database connection timeout'
                })
            }
            console.error(error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong.",
            });
        }
    }),

    getSponsorMemberships: protectedProcedure.query(async ({ ctx }) => {
        try {
            const sponsorMemberships = await ctx.db.sponsorMembership.findMany({
                include: {
                    user: {
                        select: {
                            userId: true,
                            fullName: true,
                            email: true,
                            phone: true,
                            address: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return sponsorMemberships;
        } catch (error) {
            if (error instanceof TRPCError) {
                console.error(error.message);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: error.message,
                });
            }
            else if (error instanceof TRPCClientError) {
                console.error(error.message)
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'database connection timeout'
                })
            }
            console.error(error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong.",
            });
        }
    }),

    // Count buyer memberships
    getBuyerMembershipsCount: protectedProcedure.query(async ({ ctx }) => {
        try {
            const count = await ctx.db.buyerMembership.count();
            return count;
        } catch (error) {
            if (error instanceof TRPCError) {
                console.error(error.message);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: error.message,
                });
            }
            else if (error instanceof TRPCClientError) {
                console.error(error.message)
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'database connection timeout'
                })
            }
            console.error(error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong.",
            });
        }
    }),
});