import type { AssessmentResult, InsertAssessment } from "@shared/schema";

export function computeAssessmentResult(assessment: InsertAssessment): AssessmentResult {
  let score = 0;
  const factors: string[] = [];

  if (assessment.cycleRegularity !== "regular") {
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

  const riskScore: AssessmentResult["riskScore"] = score >= 3 ? "high" : score >= 1 ? "medium" : "low";

  return {
    riskScore,
    confidence: 85,
    contributingFactors: factors,
    recommendations: [
      "Consult with a healthcare provider",
      "Maintain a balanced diet rich in whole foods",
      "Regular moderate exercise",
    ],
  };
}
