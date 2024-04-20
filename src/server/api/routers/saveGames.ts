import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

import { saveGames } from "~/server/db/schema";
import {
  createPresignedDownloadURL,
  createPresignedUploadURL,
} from "~/server/services/s3";
import { betterPromiseSettle } from "~/utils/betterPromiseSettle";

export const saveGamesRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const saves = await ctx.db.query.saveGames.findMany({
      where: (save, { eq }) => eq(save.userId, ctx.session.userId),
    });

    const results = await betterPromiseSettle(
      saves.map(async (save) => ({
        ...save,
        downloadLink: save.fileKey
          ? await createPresignedDownloadURL(save.fileKey)
          : null,
      })),
    );

    if (results.rejected.length > 0) {
      console.error(results.rejected.map((e) => e.reason));
    }

    return results.fulfilled.map((i) => i.value);
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

      await ctx.db
        .insert(saveGames)
        .values({
          uniqueMultiplayerId,
          playerName,
          farmName,
          money,
          playtime,
          path,
          userId: ctx.session.userId,
        })
        .execute();
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

      const presignedPost = await createPresignedUploadURL(key);

      await ctx.db
        .update(saveGames)
        .set({ money, playtime, fileKey: key })
        .where(eq(saveGames.id, id));

      return {
        presignedPost,
      };
    }),
});
