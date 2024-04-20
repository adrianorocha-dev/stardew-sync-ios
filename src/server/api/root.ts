import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { z } from "zod";

import { publicProcedure, createTRPCRouter, protectedProcedure } from "./trpc";
import { users } from "../db/schema";

export const appRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(({ input }) => {
      return {
        text: `hello ${input.name}!`,
      };
    }),

  // getSecretMessage: protectedProcedure.query(({ ctx }) => {
  //   return {
  //     text: `Hi ${ctx.auth.userId}, you can now see this secret message!`,
  //   };
  // }),

  listUsers: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(users);
  }),
});

export type AppRouter = typeof appRouter;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
