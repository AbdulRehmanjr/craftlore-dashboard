import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { employRouter } from "~/server/api/routers/employee";
import { lisitingRouter } from "~/server/api/routers/listing";
import { carbonRouter } from "~/server/api/routers/carbon";
import { seedRouter } from "~/server/api/routers/seed";


export const appRouter = createTRPCRouter({
  employ:employRouter,
  listing:lisitingRouter,
  carbon:carbonRouter,
  seed:seedRouter
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);