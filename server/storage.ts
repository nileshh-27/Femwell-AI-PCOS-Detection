import {
  assessments,
  type InsertAssessment,
  type AssessmentResult
} from "@shared/schema";
import { computeAssessmentResult } from "./lib/assessment";

export interface IStorage {
  createAssessment(assessment: InsertAssessment): Promise<AssessmentResult>;
}

export class DatabaseStorage implements IStorage {
  async createAssessment(assessment: InsertAssessment): Promise<AssessmentResult> {
    // Screening model (rule-based). Not a medical diagnosis.
    return await computeAssessmentResult(assessment);
  }
}

export const storage = new DatabaseStorage();
