import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { registerPasswordAuthRoutes } from "./auth/password";
import { getAuthedUser, requireAnyAuth } from "./auth/anyAuth";
import { db } from "./db";
import { assessments, insertAssessmentSchema, profiles, upsertProfileSchema } from "@shared/schema";
import { and, desc, eq } from "drizzle-orm";
import { computeAssessmentResult } from "./lib/assessment";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Always enable password-based auth endpoints.
  registerPasswordAuthRoutes(app);

  app.get("/api/auth/user", requireAnyAuth, async (req, res) => {
    const user = await getAuthedUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    return res.json(user);
  });

  // === Profile (DB-backed) ===
  app.get("/api/profile", requireAnyAuth, async (req, res) => {
    const userId = String(req.authUserId);
    const [row] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return res.json({ profile: row ?? null });
  });

  app.put("/api/profile", requireAnyAuth, async (req, res) => {
    const parsed = upsertProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input" });
    }

    const userId = String(req.authUserId);
    const now = new Date();

    const [existing] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    const values = {
      userId,
      fullName: parsed.data.fullName ?? null,
      email: parsed.data.email ?? null,
      updatedAt: now,
    };

    const [saved] = existing
      ? await db
          .update(profiles)
          .set(values)
          .where(eq(profiles.userId, userId))
          .returning()
      : await db
          .insert(profiles)
          .values({ ...values, createdAt: now })
          .returning();

    return res.json({ profile: saved });
  });

  app.delete("/api/profile", requireAnyAuth, async (req, res) => {
    const userId = String(req.authUserId);
    await db.delete(profiles).where(eq(profiles.userId, userId));
    return res.status(204).end();
  });

  // === Assessments (DB-backed) ===
  app.post("/api/assessments", requireAnyAuth, async (req, res) => {
    try {
      const input = insertAssessmentSchema.parse(req.body);
      const result = computeAssessmentResult(input);

      const userId = String(req.authUserId);

      const [inserted] = await db
        .insert(assessments)
        .values({
          userId,
          ...input,
          riskScore: result.riskScore,
          confidence: result.confidence,
          contributingFactors: result.contributingFactors,
          recommendations: result.recommendations,
        })
        .returning({ id: assessments.id });

      return res.status(201).json({ id: inserted.id, ...result });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  app.get("/api/assessments/latest", requireAnyAuth, async (req, res) => {
    const userId = String(req.authUserId);
    const [row] = await db
      .select()
      .from(assessments)
      .where(eq(assessments.userId, userId))
      .orderBy(desc(assessments.createdAt))
      .limit(1);

    if (!row) return res.status(404).json({ message: "Not found" });
    return res.json(row);
  });

  app.get("/api/assessments/:id", requireAnyAuth, async (req, res) => {
    const userId = String(req.authUserId);
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

    const [row] = await db
      .select()
      .from(assessments)
      .where(and(eq(assessments.userId, userId), eq(assessments.id, id)))
      .limit(1);

    if (!row) return res.status(404).json({ message: "Not found" });
    return res.json(row);
  });

  app.delete("/api/assessments", requireAnyAuth, async (req, res) => {
    const userId = String(req.authUserId);
    await db.delete(assessments).where(eq(assessments.userId, userId));
    return res.status(204).end();
  });

  app.post(api.assessment.submit.path, async (req, res) => {
    try {
      const input = api.assessment.submit.input.parse(req.body);
      const result = await storage.createAssessment(input);
      res.json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
