import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const employRouter = createTRPCRouter({

    getEmployees: publicProcedure
        .query(async ({ ctx }) => {
            try {
                const data: EmployeeProps[] = await ctx.db.employ.findMany()
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

    getEmployeeById: publicProcedure
        .input(z.object({ employeeId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                const data: EmployeeProps | null = await ctx.db.employ.findUnique({
                    where: { employId: input.employeeId }
                })

                if (!data) throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Employee not fond with given id'
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

    createEmployee: protectedProcedure
        .input(z.object({
            fullName: z.string(),
            skills: z.string(),
            contribution: z.string(),
            organization: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.employ.create({
                    data: {
                        fullName: input.fullName,
                        skills: input.skills,
                        contribution: input.contribution,
                        organization: input.organization
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
                console.error(error)
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong'
                })
            }
        }),

    updateEmployee: protectedProcedure
        .input(z.object({
            employeeId: z.string(),
            fullName: z.string(),
            skills: z.string(),
            contribution: z.string(),
            organization:z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.employ.update({
                    where: { employId: input.employeeId },
                    data: {
                        fullName: input.fullName,
                        skills: input.skills,
                        contribution: input.contribution,
                        organization:input.organization
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
                console.error(error)
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong'
                })
            }
        }),

    deleteEmployee: protectedProcedure
        .input(z.object({ employeeId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.employ.delete({
                    where: { employId: input.employeeId }
                })
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

});
