import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { TRPCClientError } from "@trpc/client";




export const seedRouter = createTRPCRouter({

    createPrice: publicProcedure
        .input(z.object({ categories: z.string().array() }))
        .mutation(async ({ input, ctx }) => {
            try {
                for (const category of input.categories) {
                    await ctx.db.priceCategory.createMany({
                        data: {
                            categoryName: category
                        }
                    })
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
    createPriceSubCategories: publicProcedure
        .input(z.object({
            subcategories: z.object({
                categoryId: z.string(),
                subCategoryName: z.string()
            }).array()
        }))
        .mutation(async ({ input, ctx }) => {
            try {

                for (const sub of input.subcategories) {
                    await ctx.db.priceSubCategory.create({
                        data: {
                            pricecategoryId: sub.categoryId,
                            subcategoryName: sub.subCategoryName,
                        }
                    })
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

    createCategories: publicProcedure
        .input(z.object({ categories: z.string().array() }))
        .mutation(async ({ input, ctx }) => {
            try {

                for (const category of input.categories) {
                    await ctx.db.category.createMany({
                        data: {
                            categoryName: category
                        }
                    })
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

    createSubCategories: publicProcedure
        .input(z.object({
            subcategories: z.object({
                categoryId: z.string(),
                subCategoryName: z.string()
            }).array()
        }))
        .mutation(async ({ input, ctx }) => {
            try {

                for (const sub of input.subcategories) {
                    await ctx.db.subCategory.create({
                        data: {
                            categoryId: sub.categoryId,
                            subcategoryName: sub.subCategoryName,
                        }
                    })
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

    createMaterial: publicProcedure
        .input(z.object({
            materials: z.object({
                subId: z.string(),
                materialName: z.string()
            }).array()
        }))
        .mutation(async ({ input, ctx }) => {
            try {

                for (const material of input.materials) {
                    await ctx.db.material.create({
                        data: {
                            materialName: material.materialName,
                            subcategoryId: material.subId,
                        }
                    })
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
    createSection: publicProcedure
        .input(z.object({
            sections: z.object({
                subcategoryId: z.string(),
                sectionName: z.string()
            }).array()
        }))
        .mutation(async ({ input, ctx }) => {
            try {

                for (const section of input.sections) {
                    await ctx.db.carbonSection.create({
                        data: {
                            sectionType: section.sectionName as SectionTypeProps,
                            subcategoryId: section.subcategoryId,
                        }
                    })
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

    createValues: publicProcedure
        .input(z.object({
            values: z.object({
                materialId: z.string(),
                sectionId: z.string(),
                value: z.string(),
                valueName: z.string(),
            }).array()
        }))
        .mutation(async ({ input, ctx }) => {
            try {

                for (const value of input.values) {
                    await ctx.db.carbonValue.create({
                        data: {
                            materialId: value.materialId,
                            carbonsectionId: value.sectionId,
                            value: value.value,
                            name: value.valueName,
                        },
                    })
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
})