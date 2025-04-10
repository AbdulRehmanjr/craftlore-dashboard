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

                const createdSection = await ctx.db.carbonSection.create({
                    data: {
                        subCategoryId: input.subCategoryId,
                        sectionType: input.sectionType as SectionTypeProps,
                    },
                });

                return createdSection;
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

    addSingleValue: protectedProcedure
        .input(z.object({
            sectionId: z.string(),
            materialId: z.string(),
            valueId: z.string(),
            value: z.string(),
            valueName: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                await ctx.db.carbonValue.upsert({
                    where: { valueId: input.valueId },
                    update: {
                        value: input.value,
                        name: input.valueName
                    },
                    create: {
                        valueId: input.valueId,
                        materialId: input.materialId,
                        carbonsectionId: input.sectionId,
                        value: input.value,
                        name: input.valueName
                    }
                });

                return {
                    success: true,
                    message: "Value updated successfully"
                };
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
                    message: "Something went wrong during value update.",
                });
            }
        }),

    addValues: protectedProcedure
        .input(z.object({
            values: z.array(
                z.object({
                    sectionId: z.string(),
                    materialId: z.string(),
                    valueId: z.string(),
                    value: z.string(),
                    valueName: z.string(),
                })
            )
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                if (input.values.length === 0) {
                    return {
                        success: true,
                        count: 0,
                        message: "No values to update."
                    };
                }

                const results = await ctx.db.$transaction(
                    input.values.map(valueData =>
                        ctx.db.carbonValue.upsert({
                            where: { valueId: valueData.valueId },
                            update: {
                                value: valueData.value,
                                name: valueData.valueName
                            },
                            create: {
                                valueId: valueData.valueId,
                                materialId: valueData.materialId,
                                carbonsectionId: valueData.sectionId,
                                value: valueData.value,
                                name: valueData.valueName
                            }
                        })
                    )
                );

                return {
                    success: true,
                    count: results.length,
                    message: `Successfully updated ${results.length} values.`
                };
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
                    message: "Something went wrong during batch update.",
                });
            }
        }),

    deleteValue: protectedProcedure
        .input(z.object({ valueId: z.string() }))
        .mutation(async ({ input, ctx }) => {
            try {
                // Check if value exists
                const value = await ctx.db.carbonValue.findUnique({
                    where: { valueId: input.valueId }
                });
                
                if (!value) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Value not found'
                    });
                }
                
                // Delete the value
                await ctx.db.carbonValue.delete({ 
                    where: { valueId: input.valueId } 
                });
                
                return {
                    success: true,
                    message: "Value deleted successfully"
                };
            } catch (error) {
                if (error instanceof TRPCError) {
                    console.error(error.message);
                    throw new TRPCError({
                        code: error.code,
                        message: error.message,
                    });
                }
                console.error(error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Something went wrong when deleting the value.",
                });
            }
        }),
        
    deleteSection: protectedProcedure
        .input(z.object({ sectionId: z.string() }))
        .mutation(async ({ input, ctx }) => {
            try {
                // Check if the section exists
                const section = await ctx.db.carbonSection.findUnique({
                    where: { carbonsectionId: input.sectionId },
                    include: { values: true }
                });
                
                if (!section) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Section not found'
                    });
                }
                
                // Use transaction to delete all values and the section
                await ctx.db.$transaction(async (tx) => {
                    // First delete all values in the section
                    if (section.values.length > 0) {
                        await tx.carbonValue.deleteMany({
                            where: { carbonsectionId: input.sectionId }
                        });
                    }
                    
                    // Then delete the section
                    await tx.carbonSection.delete({
                        where: { carbonsectionId: input.sectionId }
                    });
                });
                
                return {
                    success: true,
                    message: "Section and all its values deleted successfully"
                };
            } catch (error) {
                if (error instanceof TRPCError) {
                    console.error(error.message);
                    throw new TRPCError({
                        code: error.code,
                        message: error.message,
                    });
                }
                console.error(error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Something went wrong when deleting the section.",
                });
            }
        }),
});