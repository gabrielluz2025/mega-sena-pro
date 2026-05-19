import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getAllLotteries,
  getLatestDraws,
  getUserBets,
  getUserBetsByLottery,
  getAISuggestions,
  getOrCreateUserWallet,
  getDb,
} from "../db";
import { generateAIPredictions } from "../lottery-analysis";
import { draws, aiSuggestions, userBets, userWallet, lotteries } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const lotteryRouter = router({
  getLotteries: publicProcedure.query(async () => {
    return getAllLotteries();
  }),

  getRecentDraws: publicProcedure
    .input(
      z.object({
        lotteryId: z.number(),
        limit: z.number().default(100),
      })
    )
    .query(async ({ input }) => {
      const drawsList = await getLatestDraws(input.lotteryId, input.limit);
      return drawsList.map((draw) => ({
        ...draw,
        numbers: JSON.parse(draw.numbers as string),
      }));
    }),

  addDraw: protectedProcedure
    .input(
      z.object({
        lotteryId: z.number(),
        drawNumber: z.number(),
        numbers: z.array(z.number()),
        drawDate: z.date(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(draws).values({
        lotteryId: input.lotteryId,
        drawNumber: input.drawNumber,
        numbers: JSON.stringify(input.numbers),
        drawDate: input.drawDate,
      });

      return result;
    }),

  getAIPredictions: protectedProcedure
    .input(
      z.object({
        lotteryId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const drawsList = await getLatestDraws(input.lotteryId, 100);
      const lotteryResult = await db
        .select()
        .from(lotteries)
        .where(eq(lotteries.id, input.lotteryId))
        .limit(1);
      const lottery = lotteryResult[0];

      if (!lottery) throw new Error("Lottery not found");

      const allNumbers = drawsList.map((draw) => JSON.parse(draw.numbers as string));
      const predictions = generateAIPredictions(
        allNumbers,
        lottery.totalNumbers,
        lottery.numbersPerDraw
      );

      await db.insert(aiSuggestions).values({
        userId: ctx.user.id,
        lotteryId: input.lotteryId,
        suggestedNumbers: JSON.stringify(predictions.numbers),
        confidence: predictions.confidence,
        strategyBreakdown: JSON.stringify(predictions.breakdown),
      });

      return {
        numbers: predictions.numbers,
        confidence: predictions.confidence,
        breakdown: predictions.breakdown,
      };
    }),

  getUserBets: protectedProcedure
    .input(
      z.object({
        lotteryId: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      let bets;
      if (input.lotteryId) {
        bets = await getUserBetsByLottery(ctx.user.id, input.lotteryId);
      } else {
        bets = await getUserBets(ctx.user.id);
      }

      return bets.map((bet) => ({
        ...bet,
        betNumbers: JSON.parse(bet.betNumbers as string),
      }));
    }),

  saveBet: protectedProcedure
    .input(
      z.object({
        lotteryId: z.number(),
        betNumbers: z.array(z.number()),
        amount: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const wallet = await getOrCreateUserWallet(ctx.user.id);
      if (wallet) {
        const newTotalSpent = (wallet.totalSpent || 0) + input.amount;
        await db
          .update(userWallet)
          .set({
            totalSpent: newTotalSpent,
            netProfit: (wallet.totalWon || 0) - newTotalSpent,
            roi: wallet.totalWon
              ? Math.round(((wallet.totalWon - newTotalSpent) / newTotalSpent) * 100)
              : 0,
          })
          .where(eq(userWallet.userId, ctx.user.id));
      }

      const result = await db.insert(userBets).values({
        userId: ctx.user.id,
        lotteryId: input.lotteryId,
        betNumbers: JSON.stringify(input.betNumbers),
        amount: input.amount,
        status: "pending",
      });

      return result;
    }),

  getWallet: protectedProcedure.query(async ({ ctx }) => {
    return getOrCreateUserWallet(ctx.user.id);
  }),

  getSuggestionsHistory: protectedProcedure
    .input(
      z.object({
        lotteryId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const suggestions = await getAISuggestions(ctx.user.id, input.lotteryId);
      return suggestions.map((sugg) => ({
        ...sugg,
        suggestedNumbers: JSON.parse(sugg.suggestedNumbers as string),
        strategyBreakdown: JSON.parse(sugg.strategyBreakdown as string),
        actualNumbers: sugg.actualNumbers ? JSON.parse(sugg.actualNumbers as string) : null,
      }));
    }),

  getStatisticalAnalysis: publicProcedure
    .input(
      z.object({
        lotteryId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const drawsList = await getLatestDraws(input.lotteryId, 100);
      const allNumbers = drawsList.map((draw) => JSON.parse(draw.numbers as string));

      const frequency = new Map<number, number>();

      allNumbers.forEach((draw: number[]) => {
        draw.forEach((num: number) => {
          frequency.set(num, (frequency.get(num) || 0) + 1);
        });
      });

      return {
        frequency: Object.fromEntries(frequency),
        totalDraws: allNumbers.length,
        recentDraws: allNumbers.slice(-10),
      };
    }),
});
