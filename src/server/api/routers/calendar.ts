import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { GaxiosError } from "gaxios";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { authClient } from "~/server/config/oAuth";


export const calendarRouter = createTRPCRouter({

    googleOAuth: publicProcedure.mutation(() => {
        try {
            const scope = ['https://www.googleapis.com/auth/calendar']
            const url = authClient.generateAuthUrl({
                access_type: "offline",
                scope: scope
            })
            return url
        } catch (error) {
            console.error(error)
            throw new TRPCError({
                code: "NOT_FOUND",
                message: 'Something went wrong'
            })
        }
    }),

    createCalender: protectedProcedure
        .input(z.object({ token: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                const response = (await authClient.getToken(input.token)) 
                authClient.setCredentials(response.tokens)

                await ctx.db.googleToken.create({
                    data: {
                        refreshToken: response.tokens.refresh_token ?? 'none',
                        accountId: ctx.session.user.id,
                        email: ctx.session.user.email,
                    }
                })
                
            } catch (error) {
                if (error instanceof GaxiosError) {
                    console.error(error)
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: error.message
                    })
                } else if (error instanceof TRPCClientError) {
                    console.error(error)
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: error.message
                    })
                }
                console.error(error)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: 'Something went wrong'
                })
            }
        }),

    calendarConnection: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                const response = await ctx.db.googleToken.findFirst({
                    where: { accountId: ctx.session.user.id }
                })

                if (!response) return false
                return true
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.log(error.message)
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: error.message
                    })
                }
                console.log(error)
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Something went wrong.'
                })
            }
        }),

})