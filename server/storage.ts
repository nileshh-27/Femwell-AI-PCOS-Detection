import {
  assessments,
  type InsertAssessment,
  type AssessmentResult
} from "@shared/schema";

export interface IStorage {
  createAssessment(assessment: InsertAssessment): Promise<AssessmentResult>;
}

export class DatabaseStorage implements IStorage {
  async createAssessment(assessment: InsertAssessment): Promise<AssessmentResult> {
    // In a real app, this would be an AI model.
    // Here we implement a simple rule-based mock for the demo.
    
    let score = 0;
    const factors: string[] = [];
    
    if (assessment.cycleRegularity !== 'regular') {
      score += 2;
      factors.push("Irregular Menstrual Cycle");
    }
    
    if (assessment.familyHistory) {
      score += 1;
      factors.push("Family History");
    }
    
    if (assessment.symptoms.includes("acne") || assessment.symptoms.includes("hair_growth")) {
      score += 1;
      factors.push("Androgenic Symptoms");
    }

    const riskScore = score >= 3 ? "high" : score >= 1 ? "medium" : "low";
    
    return {
      riskScore,
      confidence: 85,
      contributingFactors: factors,
      recommendations: [
        "Consult with a healthcare provider",
        "Maintain a balanced diet rich in whole foods",
        "Regular moderate exercise"
      ]
    };
  }
}

export const storage = new DatabaseStorage();
