import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { z } from "zod";

import { publicProcedure, createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(({ input }) => {
      return {
        text: `hello ${input.name}!`,
      };
    }),
});

export type AppRouter = typeof appRouter;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
