import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";




export const categoryRouter = createTRPCRouter({


    getCategoryId: protectedProcedure
        .input(z.object({ categoryId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                const data: CategoryProps | null = await ctx.db.category.findUnique({
                    where: {
                        categoryId: input.categoryId,
                    }
                })

                if (!data) throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Category not found with given id'
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
                else if (error instanceof TRPCError) {
                    console.error(error.message)
                    throw new TRPCError({
                        code: error.code,
                        message: error.message
                    })
                }
                console.error(error)
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong'
                })
            }
        }),

    getCategories: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                const data: CategoryProps[] = await ctx.db.category.findMany({
                    orderBy: {
                        rank: 'asc'
                    }
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

    getSubByCatId: protectedProcedure
        .input(z.object({ categoryId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                const data: SubCategoryProps[] = await ctx.db.subCategory.findMany({
                    where: { categoryId: input.categoryId }
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
        .input(z.object({ categoryName: z.string(), rank: z.number() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.category.create({
                    data: {
                        categoryName: input.categoryName,
                        rank: input.rank
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

    editCategory: protectedProcedure
        .input(z.object({
            categoryId: z.string(),
            categoryName: z.string(),
            rank: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.category.update({
                    where: { categoryId: input.categoryId },
                    data: {
                        categoryName: input.categoryName,
                        rank: input.rank
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

    editSubCategory: protectedProcedure
        .input(z.object({ subcategoryId: z.string(), subcategoryName: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.subCategory.update({
                    where: { subcategoryId: input.subcategoryId },
                    data: {
                        subcategoryName: input.subcategoryName
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
                await ctx.db.subCategory.delete({
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

    createMaterial: protectedProcedure
        .input(z.object({
            materialName: z.string(),
            subId: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                await ctx.db.material.create({
                    data: {
                        materialName: input.materialName,
                        subcategoryId: input.subId
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
                await ctx.db.material.delete({
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

    getAllMaterials: protectedProcedure
        .input(z.object({ subId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                const materials: MaterialProps[] = await ctx.db.material.findMany({
                    where: {
                        subcategoryId: input.subId
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


})