import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { employRouter } from "~/server/api/routers/employee";
import { lisitingRouter } from "~/server/api/routers/listing";


export const appRouter = createTRPCRouter({
  employ:employRouter,
  listing:lisitingRouter
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);