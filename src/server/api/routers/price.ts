import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const priceRouter = createTRPCRouter({

    getCategories: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                const data: CategoryProps[] = await ctx.db.priceCategory.findMany()
                return data
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'database connection timeout'
                    })
                }
                console.error(error)
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong'
                })
            }
        }),

    getSubByCatId: protectedProcedure
        .input(z.object({ categoryId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                const data = await ctx.db.priceSubCategory.findMany({
                    where: { pricecategoryId: input.categoryId }
                })
                return data
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'database connection timeout'
                    })
                }
                console.error(error)
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong'
                })
            }
        }),

    createCategory: protectedProcedure
        .input(z.object({ categoryName: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.category.create({
                    data: {
                        categoryName: input.categoryName
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

    deleteCategory: protectedProcedure
        .input(z.object({ categoryId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.category.delete({
                    where: {
                        categoryId: input.categoryId
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

    createSubCategory: protectedProcedure
        .input(z.object({ categoryId: z.string(), subName: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.subCategory.create({
                    data: {
                        subcategoryName: input.subName,
                        categoryId: input.categoryId
                    }
                })
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

    deleteSubCategory: protectedProcedure
        .input(z.object({ subcategoryId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.priceSubCategory.delete({
                    where: {
                        subcategoryId: input.subcategoryId
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

    getSectionsBySubCategory: protectedProcedure
        .input(z.object({ subCategoryId: z.string() }))
        .query(async ({ input, ctx }) => {
            try {
                const sections = await ctx.db.priceSection.findMany({
                    where: { priceSubCategoryId: input.subCategoryId },
                    include: { PriceValue: true },
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
                const existingSection = await ctx.db.priceSection.findFirst({
                    where: {
                        priceSubCategoryId: input.subCategoryId,
                        priceSectionType: input.sectionType as PriceSectionTypeProps,
                    },
                });

                if (existingSection)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: `Section type "${input.sectionType}" already exists for this subcategory.`
                    });

                await ctx.db.priceSection.create({
                    data: {
                        priceSubCategoryId: input.subCategoryId,
                        priceSectionType: input.sectionType as PriceSectionTypeProps,
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

    getAllMaterials: protectedProcedure
        .input(z.object({ subId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                const materials = await ctx.db.priceMaterial.findMany({
                    where: {
                        pricesubcategoryId: input.subId
                    }
                });
                return materials
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

    createMaterial: protectedProcedure
        .input(z.object({
            materialName: z.string(),
            subId: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                await ctx.db.priceMaterial.create({
                    data: {
                        materialName: input.materialName,
                        pricesubcategoryId: input.subId
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

    deleteMaterial: protectedProcedure
        .input(z.object({ materialId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.priceMaterial.delete({
                    where: {
                        materialId: input.materialId
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

    createPriceValueProp: protectedProcedure
        .input(z.object({
            sectionId: z.string(),
            materialId: z.string(),
            valueName:z.string(),
            value: z.string().min(1, 'Value is required'),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                await ctx.db.priceValue.create({
                    data: {
                        materialId:input.materialId,
                        priceSectionId: input.sectionId,
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

    updatePriceValueProp: protectedProcedure
        .input(z.object({
            valueId: z.string(),
            value: z.string(),
            valueName:z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                await ctx.db.priceValue.update({
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
