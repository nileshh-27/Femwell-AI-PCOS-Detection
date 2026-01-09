import type { Express, Request, Response } from "express";
import crypto from "node:crypto";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "../db";
import { authTokens, users } from "@shared/models/auth";
import { and, eq, gt, isNull } from "drizzle-orm";

const EMAIL_MAX_LENGTH = 320;
const PASSWORD_MIN_LENGTH = 8;

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(EMAIL_MAX_LENGTH),
  password: z.string().min(PASSWORD_MIN_LENGTH),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(EMAIL_MAX_LENGTH),
  password: z.string().min(1),
});

function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input, "utf8").digest("hex");
}

function generateToken(): string {
  // 256-bit random token, URL-safe.
  return crypto.randomBytes(32).toString("base64url");
}

function parseCookieHeader(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  const out: Record<string, string> = {};
  for (const part of cookieHeader.split(";")) {
    const [rawKey, ...rawValParts] = part.split("=");
    const key = rawKey?.trim();
    if (!key) continue;
    const value = rawValParts.join("=").trim();
    if (!value) continue;
    out[key] = decodeURIComponent(value);
  }
  return out;
}

export function getTokenFromRequest(req: Request): string | null {
  const auth = req.header("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    const token = auth.slice("bearer ".length).trim();
    if (token) return token;
  }

  const cookies = parseCookieHeader(req.headers.cookie);
  const cookieToken = cookies["auth_token"];
  return cookieToken || null;
}

export async function getUserFromToken(token: string) {
  const tokenHash = sha256Hex(token);
  const now = new Date();

  const [row] = await db
    .select({
      user: users,
      tokenId: authTokens.id,
    })
    .from(authTokens)
    .innerJoin(users, eq(authTokens.userId, users.id))
    .where(
      and(
        eq(authTokens.tokenHash, tokenHash),
        isNull(authTokens.revokedAt),
        gt(authTokens.expiresAt, now)
      )
    );

  if (!row) return null;

  // Best-effort last-used tracking.
  try {
    await db
      .update(authTokens)
      .set({ lastUsedAt: now })
      .where(eq(authTokens.id, row.tokenId));
  } catch {
    // ignore
  }

  return row.user;
}

function setAuthCookie(res: Response, token: string, maxAgeMs: number) {
  res.cookie("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: maxAgeMs,
    path: "/",
  });
}

function clearAuthCookie(res: Response) {
  res.clearCookie("auth_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

async function issueTokenForUser(userId: string) {
  const token = generateToken();
  const tokenHash = sha256Hex(token);
  const ttlMs = 7 * 24 * 60 * 60 * 1000;
  const expiresAt = new Date(Date.now() + ttlMs);

  await db.insert(authTokens).values({
    userId,
    tokenHash,
    expiresAt,
  });

  return { token, ttlMs };
}

export function registerPasswordAuthRoutes(app: Express): void {
  app.post("/api/auth/register", async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input" });
    }

    const { email, password } = parsed.data;

    const [existing] = await db.select().from(users).where(eq(users.email, email));
    if (existing) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [created] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
      })
      .returning();

    const { token, ttlMs } = await issueTokenForUser(created.id);
    setAuthCookie(res, token, ttlMs);

    // NOTE: token is persisted as a hash in DB (auth_tokens.token_hash).
    return res.status(201).json({
      user: created,
      token,
      expiresInMs: ttlMs,
    });
  });

  app.post("/api/auth/login", async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input" });
    }

    const { email, password } = parsed.data;

    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user?.passwordHash) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const { token, ttlMs } = await issueTokenForUser(user.id);
    setAuthCookie(res, token, ttlMs);

    return res.json({
      user,
      token,
      expiresInMs: ttlMs,
    });
  });

  app.post("/api/auth/logout", async (req, res) => {
    const token = getTokenFromRequest(req);
    if (token) {
      const tokenHash = sha256Hex(token);
      try {
        await db
          .update(authTokens)
          .set({ revokedAt: new Date() })
          .where(eq(authTokens.tokenHash, tokenHash));
      } catch {
        // ignore
      }
    }

    clearAuthCookie(res);
    return res.status(204).end();
  });
}
