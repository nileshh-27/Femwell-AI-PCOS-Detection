export * from "./models/auth";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  age: integer("age").notNull(),
  height: integer("height").notNull(), // cm
  weight: integer("weight").notNull(), // kg
  cycleRegularity: text("cycle_regularity", { enum: ["regular", "irregular", "absent"] }).notNull(),
  symptoms: text("symptoms").array().notNull(), // acne, hair_growth, hair_loss, etc.
  familyHistory: boolean("family_history").notNull(),
  exerciseFrequency: text("exercise_frequency", { enum: ["sedentary", "moderate", "active"] }).notNull(),
  sleepQuality: text("sleep_quality", { enum: ["good", "fair", "poor"] }).notNull(),
  riskScore: text("risk_score", { enum: ["low", "medium", "high"] }), // Computed by backend/mock
});

// === SCHEMAS ===
export const insertAssessmentSchema = createInsertSchema(assessments).omit({ 
  id: true, 
  riskScore: true 
});

// === EXPLICIT TYPES ===
export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;

export type AssessmentResult = {
  riskScore: "low" | "medium" | "high";
  confidence: number;
  contributingFactors: string[];
  recommendations: string[];
};

export type CreateAssessmentRequest = InsertAssessment;
