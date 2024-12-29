import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const craftRouter = createTRPCRouter({

    getSectionsBySubCategory: protectedProcedure
        .input(z.object({ subCategoryId: z.string() }))
        .query(async ({ input, ctx }) => {
            try {
                const sections = await ctx.db.craftSection.findMany({
                    where: { subCategoryId: input.subCategoryId },
                    orderBy: {
                        rank: 'asc'
                    },
                    include: {
                        CraftSubSection: {
                            include: {
                                CraftContent: true,
                            }
                        }
                    }
                });
                return sections
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

    createSection: protectedProcedure
        .input(z.object({
            subCategoryId: z.string(),
            sectionName: z.string(),
            rank: z.number()
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                await ctx.db.craftSection.create({
                    data: {
                        subCategoryId: input.subCategoryId,
                        sectionName: input.sectionName,
                        rank: input.rank
                    },
                });

            } catch (error) {
                if (error instanceof TRPCError) {
                    console.error(error.message);
                    throw new TRPCError({
                        code: error.code,
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

    updateSection: protectedProcedure
        .input(z.object({
            sectionId: z.string(),
            sectionName: z.string(),
            rank: z.number()
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                await ctx.db.craftSection.update({
                    where: { craftsectionId: input.sectionId },
                    data: { sectionName: input.sectionName, rank: input.rank },
                });

            } catch (error) {
                if (error instanceof TRPCError) {
                    console.error(error.message);
                    throw new TRPCError({
                        code: error.code,
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

    deleteSection: protectedProcedure
        .input(z.object({ sectionId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.craftSection.delete({
                    where: {
                        craftsectionId: input.sectionId
                    }
                })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'database connection timeout'
                    })
                }
                else if (error instanceof TRPCError) {
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

    createSubSection: protectedProcedure
        .input(z.object({
            sectionId: z.string(),
            sectionName: z.string(),
            rank: z.number()
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                await ctx.db.craftSubSection.create({
                    data: {
                        sectionId: input.sectionId,
                        sectionName: input.sectionName,
                        rank: input.rank,
                    },
                });

            } catch (error) {
                if (error instanceof TRPCError) {
                    console.error(error.message);
                    throw new TRPCError({
                        code: error.code,
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

    updateSubSection: protectedProcedure
        .input(z.object({
            sectionId: z.string(),
            sectionName: z.string(),
            rank: z.number()
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                await ctx.db.craftSubSection.update({
                    where: { craftsubsectionId: input.sectionId },
                    data: { sectionName: input.sectionName, rank: input.rank },
                });
            } catch (error) {
                if (error instanceof TRPCError) {
                    console.error(error.message);
                    throw new TRPCError({
                        code: error.code,
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

    deleteSubSection: protectedProcedure
        .input(z.object({ subId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.craftSubSection.delete({
                    where: {
                        craftsubsectionId: input.subId
                    }
                })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'database connection timeout'
                    })
                }
                else if (error instanceof TRPCError) {
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

    createSubSectionContent: protectedProcedure
        .input(z.object({
            subSectionId: z.string(),
            content: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const existingContent = await ctx.db.craftContent.findFirst({
                    where: { subsectionId: input.subSectionId }
                });

                if (existingContent) {
                    return ctx.db.craftContent.update({
                        where: { craftsubsectionId: existingContent.craftsubsectionId },
                        data: { content: input.content, },
                    });
                } else {
                    return ctx.db.craftContent.create({
                        data: {
                            content: input.content,
                            subsectionId: input.subSectionId
                        },
                    });
                }
            } catch (error) {
                if (error instanceof TRPCError) {
                    console.error(error.message);
                    throw new TRPCError({
                        code: error.code,
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

    updateValueProp: protectedProcedure
        .input(z.object({
            valueId: z.string(),
            value: z.string(),
            valueName: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                await ctx.db.carbonValue.update({
                    where: { valueId: input.valueId },
                    data: {
                        value: input.value,
                        name: input.valueName
                    },
                });
            } catch (error) {
                if (error instanceof TRPCError) {
                    console.error(error.message);
                    throw new TRPCError({
                        code: error.code,
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
