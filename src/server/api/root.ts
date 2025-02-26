import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { employRouter } from "~/server/api/routers/employee";
import { lisitingRouter } from "~/server/api/routers/listing";
import { carbonRouter } from "~/server/api/routers/carbon";
import { seedRouter } from "~/server/api/routers/seed";
import { priceRouter } from "~/server/api/routers/price";
import { categoryRouter } from "~/server/api/routers/category";
import { giRouter } from "~/server/api/routers/gi";
import { craftRouter } from "~/server/api/routers/craft-profile";
import { ranksRouter } from "~/server/api/routers/rank";

export const appRouter = createTRPCRouter({
  employ:employRouter,
  listing:lisitingRouter,
  carbon:carbonRouter,
  seed:seedRouter,
  price:priceRouter,
  category:categoryRouter,
  gi:giRouter,
  craft:craftRouter,
  rank:ranksRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);