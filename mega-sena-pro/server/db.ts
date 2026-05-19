import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  lotteries,
  draws,
  userBets,
  aiSuggestions,
  userWallet,
  aiStrategies,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Lottery queries
 */
export async function getLotteryByName(name: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(lotteries).where(eq(lotteries.name, name)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllLotteries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(lotteries);
}

/**
 * Draw queries
 */
export async function getDrawsByLotteryId(lotteryId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(draws).where(eq(draws.lotteryId, lotteryId)).orderBy(desc(draws.drawDate));
}

export async function getLatestDraws(lotteryId: number, limit: number = 100) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(draws)
    .where(eq(draws.lotteryId, lotteryId))
    .orderBy(desc(draws.drawDate))
    .limit(limit);
}

/**
 * User Bet queries
 */
export async function getUserBets(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userBets).where(eq(userBets.userId, userId)).orderBy(desc(userBets.createdAt));
}

export async function getUserBetsByLottery(userId: number, lotteryId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(userBets)
    .where(and(eq(userBets.userId, userId), eq(userBets.lotteryId, lotteryId)))
    .orderBy(desc(userBets.createdAt));
}

/**
 * AI Suggestion queries
 */
export async function getAISuggestions(userId: number, lotteryId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(aiSuggestions)
    .where(and(eq(aiSuggestions.userId, userId), eq(aiSuggestions.lotteryId, lotteryId)))
    .orderBy(desc(aiSuggestions.generatedAt));
}

/**
 * User Wallet queries
 */
export async function getUserWallet(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(userWallet).where(eq(userWallet.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrCreateUserWallet(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  let wallet = await getUserWallet(userId);
  if (!wallet) {
    await db.insert(userWallet).values({
      userId,
      totalSpent: 0,
      totalWon: 0,
      netProfit: 0,
      roi: 0,
    });
    wallet = await getUserWallet(userId);
  }
  return wallet;
}

/**
 * AI Strategy queries
 */
export async function getAIStrategies(userId: number, lotteryId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(aiStrategies)
    .where(and(eq(aiStrategies.userId, userId), eq(aiStrategies.lotteryId, lotteryId)))
    .orderBy(desc(aiStrategies.weight));
}

// TODO: add more feature queries as needed
