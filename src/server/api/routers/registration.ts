
import { hash } from "bcrypt";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from 'zod'
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";

export const registerRouter = createTRPCRouter({

    updatePassword: protectedProcedure.input(z.object({ email: z.string(), updatedPassword: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {

                const data = await ctx.db.account.findUnique({ where: { email: input.email } })

                if (!data) throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Please check email.No user with this email."
                })

                const encyrptedPassword = await hash(input.updatedPassword, 10)
                await ctx.db.account.update({
                    where: { email: input.email },
                    data: { password: encyrptedPassword }
                })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    })
                } else if (error instanceof TRPCError) {
                    console.error(error.message)
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: error.message
                    })
                }
                console.error(error)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        })
})