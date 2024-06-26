import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { z } from "zod";

import { saveGamesRouter } from "./routers/saveGames";
import { usersRouter } from "./routers/users";
import { publicProcedure, createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(({ input }) => {
      return {
        text: `hello ${input.name}!`,
      };
    }),

  users: usersRouter,
  saveGames: saveGamesRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
