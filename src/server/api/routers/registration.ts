
import { hash } from "bcrypt";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import z from 'zod'
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { randomInt } from "crypto";
import { env } from "~/env";
import { type Transporter, createTransport } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import type Mail from "nodemailer/lib/mailer";
import axios, { AxiosError } from "axios";

export const registerRouter = createTRPCRouter({

    createSeller: publicProcedure.input(z.object({ email: z.string(), password: z.string() }))
        .mutation(async ({ ctx, input }) => {     
            try {
                const encyrptedPassword = await hash(input.password, 10)
                await ctx.db.account.create({
                    data: {
                        email: input.email,
                        password: encyrptedPassword
                    }
                })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    })
                }
                console.error(error)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),

    forgotPassword: protectedProcedure.input(z.object({ email: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {

                const data = await ctx.db.account.findUnique({ where: { email: input.email } })

                if (!data) throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Please check email.No user with this email."
                })

                const otp = randomInt(100000, 999999) + ""

                const sender = env.ZOHO_MAIL
                const password = env.ZOHO_PASSWORD
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
                const transporter: Transporter<SMTPTransport.SentMessageInfo> = createTransport({
                    host: "smtp.zoho.com",
                    port: 587,
                    secure: false,
                    auth: {
                        user: sender,
                        pass: password,
                    },
                })

                const email: Mail.Options = {
                    from: `${sender}`,
                    to: `${input.email}`,
                    subject: `Reset your password`,
                    html: `  
                    <table
                    style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; font-family: Arial, sans-serif;">
                    <tr>
                        <td style=" padding: 15px; text-align: center;">
                            <img src="https://res.cloudinary.com/dbjiys9se/image/upload/v1723287288/kolibristay/logo_primary_cigsju.png"
                                alt="Kolibri stay" style="width: 100px;">
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 10px;">
                            <h2 style="margin-bottom: 10px;">Booking confirmation</h2>
                            <p>Dear customer,</p>
                            <p>Here is your otp please do not share it with anyone :${otp}</p>
                        </td>
                          
                    </tr>
                    <tr>
                        <td>
                            <p style="margin-bottom:10px;">Best regards,</p>
                            <h2 style="margin-bottom:10px;">Kolibri stay</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 15px; text-align: center; color:black">
                            <img src="https://res.cloudinary.com/dbjiys9se/image/upload/v1723287288/kolibristay/logo_primary_cigsju.png"
                                alt="Kolibri stay" style="width: 100px;">
                            <p>Kolibristay</p>
                        </td>
                    </tr>
                </table>`,
                }
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                await transporter.sendMail(email)
                return otp
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
                        code: error.code,
                        message: error.message
                    })
                }
                console.error(error)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),

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
        }),

    createSuToken: protectedProcedure
        .input(z.object({ hotelCode: z.string() }))
        .query(async ({input}) => {
            try {

                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${env.API_KEY}`,
                    'app-id': `${env.APP_ID}`
                }

                const hotelJson = {
                    "hotelid": input.hotelCode
                }

                const response = await axios.post(`${env.API_SU}/widget/getWidgetAccessToken`, hotelJson, { headers })

                return response.data as SuTokenProps
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    })
                } else if (error instanceof AxiosError) {
                    const suError = error.response?.data as SUErrorProps
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: suError.Errors[0]?.ShortText
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