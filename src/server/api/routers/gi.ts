import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";




export const giRouter = createTRPCRouter({

    giReports: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                const data = await ctx.db.gIReport.findMany()
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
        })
})