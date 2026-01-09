import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { users } from "./models/auth";

export * from "./models/auth";

// === TABLE DEFINITIONS ===
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id")
    .notNull()
    // users table comes from ./models/auth via the export above
    .references(() => users.id, { onDelete: "cascade" }),
  fullName: text("full_name"),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  age: integer("age").notNull(),
  height: integer("height").notNull(), // cm
  weight: integer("weight").notNull(), // kg
  cycleRegularity: text("cycle_regularity", { enum: ["regular", "irregular", "absent"] }).notNull(),
  symptoms: text("symptoms").array().notNull(), // acne, hair_growth, hair_loss, etc.
  familyHistory: boolean("family_history").notNull(),
  exerciseFrequency: text("exercise_frequency", { enum: ["sedentary", "moderate", "active"] }).notNull(),
  sleepQuality: text("sleep_quality", { enum: ["good", "fair", "poor"] }).notNull(),
  riskScore: text("risk_score", { enum: ["low", "medium", "high"] }).notNull(),
  confidence: integer("confidence").notNull(),
  contributingFactors: text("contributing_factors").array().notNull(),
  recommendations: text("recommendations").array().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===
export const insertAssessmentSchema = createInsertSchema(assessments).omit({ 
  id: true, 
  userId: true,
  riskScore: true,
  confidence: true,
  contributingFactors: true,
  recommendations: true,
  createdAt: true,
});

export const upsertProfileSchema = z.object({
  fullName: z.string().trim().min(1).max(200).nullable().optional(),
  email: z.string().trim().email().max(320).nullable().optional(),
});

// === EXPLICIT TYPES ===
export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;

export type Profile = typeof profiles.$inferSelect;

export type AssessmentResult = {
  riskScore: "low" | "medium" | "high";
  confidence: number;
  contributingFactors: string[];
  recommendations: string[];
  // Screening output (not a diagnosis)
  pcosLikelihood: "unlikely" | "possible" | "likely";
  pcosPossible: boolean;
  // 0..1 probability from ML model (or heuristic fallback)
  pcosProbability: number;
  modelVersion: string;
};

export type CreateAssessmentRequest = InsertAssessment;
