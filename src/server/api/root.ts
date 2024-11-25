import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { hotelRouter } from "~/server/api/routers/hotel";
import { roomRouter } from "~/server/api/routers/room";
import { ratePlanRouter } from "~/server/api/routers/rateplan";
import { priceRouter } from "~/server/api/routers/price";
import { payPalRouter } from "~/server/api/routers/paypal";
import { calendarRouter } from "~/server/api/routers/calendar";
import { registerRouter } from "~/server/api/routers/registration";


export const appRouter = createTRPCRouter({
  hotel: hotelRouter,
  room: roomRouter,
  rateplan: ratePlanRouter,
  price: priceRouter,
  paypal: payPalRouter,
  calendar: calendarRouter,
  registration: registerRouter
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);