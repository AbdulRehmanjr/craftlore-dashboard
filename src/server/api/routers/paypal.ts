/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { randomUUID } from "crypto";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCClientError } from "@trpc/client";
import axios, { AxiosError } from "axios";
import { env } from "~/env";
import { z } from "zod";
import { TRPCError } from "@trpc/server";


export const payPalRouter = createTRPCRouter({

    getAuthToken: publicProcedure.query(async () => {
        const username = env.PAYPAL_CLIENT
        const password = env.PAYPAL_SECRET
        const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');
        try {
            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Accept-Language': 'en_US',
                    'Authorization': `Basic ${base64Credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            };
            const data = 'grant_type=client_credentials';
            const response = await axios.post(`${process.env.PAYPAL_API}/v1/oauth2/token`, data, config)
            const access_token = response.data.access_token;
            return access_token;
        } catch (error) {
            if (error instanceof AxiosError)
                console.log(error.response?.data)
            throw error
        }
    }
    ),

    paypalConnection: protectedProcedure
        .query(async ({ ctx }) => {
            try {

                const response = await ctx.db.sellerPayPal.findUnique({
                    where: { email: ctx.session.user.email ?? 'none' }
                })

                if (response) return true
                return false
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

    connectToPayPal: protectedProcedure
        .mutation(async (): Promise<string> => {

            try {
                const customId: string = randomUUID().toString()
                const BN_CODE = process.env.BN_CODE
                const username = env.PAYPAL_CLIENT
                const password = env.PAYPAL_SECRET
                const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');

                const config = {
                    headers: {
                        'Accept': 'application/json',
                        'Accept-Language': 'en_US',
                        'Authorization': `Basic ${base64Credentials}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                };

                const dataTokenReq = 'grant_type=client_credentials';
                const tokenResponse = await axios.post(`${process.env.PAYPAL_API}/v1/oauth2/token`, dataTokenReq, config)
                const access_token = tokenResponse.data.access_token;
                const data = {
                    "tracking_id": `PMS_${customId}`,
                    "operations": [
                        {
                            "operation": "API_INTEGRATION",
                            "api_integration_preference": {
                                "rest_api_integration": {
                                    "integration_method": "PAYPAL",
                                    "integration_type": "THIRD_PARTY",
                                    "third_party_details": {
                                        "features": ["PAYMENT", "REFUND", "PARTNER_FEE", "ACCESS_MERCHANT_INFORMATION"]
                                    }
                                }
                            }
                        }
                    ],
                    "products": ["EXPRESS_CHECKOUT"],
                    "legal_consents": [
                        {
                            "type": "SHARE_DATA_CONSENT",
                            "granted": true
                        }
                    ],
                    "partner_config_override": {
                        "return_url": "https://kolibri-stay.up.railway.app/dashboard/success",
                    }
                };

                const paypalApiUrl = `${process.env.PAYPAL_API}/v2/customer/partner-referrals`;
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                    'Paypal-Partner-Attribution-Id': BN_CODE
                };
                const response = await axios.post(paypalApiUrl, data, { headers })
                const url: string = response.data.links?.find((link: { rel: string; }) => link?.rel === 'action_url').href
                return url
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    })
                } else if (error instanceof AxiosError) {
                    const err =  error.response?.data as PayPalErrorProps
                    console.error(err) 
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: err.error_description
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

    createSellerInfo: protectedProcedure
        .input(z.object({ trackingId: z.string(), merchantId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.sellerPayPal.create({
                    data: {
                        trackingId: input.trackingId,
                        email: ctx.session.user.email ?? `${randomUUID().toString()}@random.com`,
                        merchantId: input.merchantId,
                        partnerClientId: "none"
                    },
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

    onBoardingStatus:protectedProcedure
            .input(z.object({ merchantId: z.string() }))
            .query(async ({ input }): Promise<StatusProps> => {
                try {
                    const BN_CODE = env.BN_CODE
                    const username = env.PAYPAL_CLIENT
                    const password = env.PAYPAL_SECRET
                    const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');

                    const config = {
                        headers: {
                            'Accept': 'application/json',
                            'Accept-Language': 'en_US',
                            'Authorization': `Basic ${base64Credentials}`,
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    };

                    const dataTokenReq = 'grant_type=client_credentials';
                    const tokenResponse = await axios.post(`${process.env.PAYPAL_API}/v1/oauth2/token`, dataTokenReq, config)
                    const access_token = tokenResponse.data.access_token;
                    const paypalApiUrl = `${env.PAYPAL_API}/v1/customer/partners/${env.PAYPAL_ID}/merchant-integrations/${input.merchantId}`;
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`,
                        'Paypal-Partner-Attribution-Id': BN_CODE
                    };
                    const response = await axios.get(paypalApiUrl, { headers })
                    const amount_recievable: boolean = response.data.payments_receivable
                    const primary_email: boolean = response.data.primary_email_confirmed
                    const responseData: StatusProps = {
                        primaryEmail: primary_email,
                        amountReceivable: amount_recievable
                    }
                    return responseData

                } catch (error) {
                    if (error instanceof AxiosError) {
                        const err =  error.response?.data as PayPalErrorProps
                        console.error(err) 
                        throw new TRPCError({
                            code: 'BAD_REQUEST',
                            message: err.error_description
                        })
                    } 
                    console.error(error)
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: "Something went wrong"
                    })
                }

            }),

})