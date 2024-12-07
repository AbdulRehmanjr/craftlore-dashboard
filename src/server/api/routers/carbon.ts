import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const carbonRouter = createTRPCRouter({

 
    getSectionsBySubCategory: protectedProcedure
        .input(z.object({ subCategoryId: z.string() }))
        .query(async ({ input, ctx }) => {
            try {
                const sections = await ctx.db.carbonSection.findMany({
                    where: { subCategoryId: input.subCategoryId },
                    include: { values: true },
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
            sectionType: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const existingSection = await ctx.db.carbonSection.findFirst({
                    where: {
                        subCategoryId: input.subCategoryId,
                        sectionType: input.sectionType as SectionTypeProps,
                    },
                });

                if (existingSection)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: `Section type "${input.sectionType}" already exists for this subcategory.`
                    });

                await ctx.db.carbonSection.create({
                    data: {
                        subCategoryId: input.subCategoryId,
                        sectionType: input.sectionType as SectionTypeProps,
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

    createValueProp: protectedProcedure
        .input(z.object({
            sectionId: z.string(),
            materialId: z.string(),
            valueName:z.string(),
            value: z.string().min(1, 'Value is required'),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                await ctx.db.carbonValue.create({
                    data: {
                        materialId:input.materialId,
                        carbonsectionId: input.sectionId,
                        value: input.value,
                        name:input.valueName,
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

    updateValueProp: protectedProcedure
        .input(z.object({
            valueId: z.string(),
            value: z.string(),
            valueName:z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                await ctx.db.carbonValue.update({
                    where: { valueId: input.valueId },
                    data: {
                        value: input.value,
                        name:input.valueName
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
