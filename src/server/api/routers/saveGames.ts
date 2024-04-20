import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

import { saveGames } from "~/server/db/schema";
import { utapi } from "~/server/uploadthing/core";
import { betterPromiseSettle } from "~/utils/betterPromiseSettle";

export const saveGamesRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const saves = await ctx.db.query.saveGames.findMany({
      where: (save, { eq }) => eq(save.userId, ctx.session.userId),
    });

    const downloadUrls = new Map(
      (
        await utapi.getFileUrls(saves.map((s) => s.fileKey).filter(Boolean))
      ).map(({ key, url }) => [key, url]),
    );

    return saves.map((s) => ({
      ...s,
      fileKey: s.fileKey && downloadUrls.get(s.fileKey),
    }));
  }),

  create: protectedProcedure
    .input(
      z.object({
        uniqueMultiplayerId: z.string(),
        playerName: z.string(),
        farmName: z.string(),
        money: z.number(),
        playtime: z.number(),
        path: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const {
        uniqueMultiplayerId,
        playerName,
        farmName,
        money,
        playtime,
        path,
      } = input;

      const saveAlreadyExists = await ctx.db.query.saveGames.findFirst({
        where: (save, { eq }) =>
          eq(save.uniqueMultiplayerId, uniqueMultiplayerId),
      });

      if (saveAlreadyExists) {
        return saveAlreadyExists;
      }

      await ctx.db.insert(saveGames).values({
        uniqueMultiplayerId,
        playerName,
        farmName,
        money,
        playtime,
        path,
        userId: ctx.session.userId,
      });
    }),

  toggleSync: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        enabled: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, enabled } = input;

      const saveExists = await ctx.db.query.saveGames.findFirst({
        where: (save, { and, eq }) =>
          and(eq(save.id, id), eq(save.userId, ctx.session.userId)),
      });

      if (!saveExists) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await ctx.db
        .update(saveGames)
        .set({ syncEnabled: enabled })
        .where(eq(saveGames.id, id));
    }),

  upload: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        money: z.number().int(),
        playtime: z.number().int(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, money, playtime } = input;

      const saveExists = await ctx.db.query.saveGames.findFirst({
        where: (save, { and, eq }) =>
          and(eq(save.id, id), eq(save.userId, ctx.session.userId)),
      });

      if (!saveExists) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const key = `saves/${ctx.session.userId}/${id}.zip`;

      const uploadUrl = await utapi.getSignedURL(key, {
        expiresIn: "5 minutes",
      });

      await ctx.db
        .update(saveGames)
        .set({ money, playtime, fileKey: key })
        .where(eq(saveGames.id, id));

      return {
        uploadUrl,
      };
    }),
});
