import type { InsertAssessment } from "@shared/schema";
import { spawn } from "node:child_process";
import path from "node:path";

export type PcosScreening = {
  pcosLikelihood: "unlikely" | "possible" | "likely";
  pcosPossible: boolean;
  pcosProbability: number;
  modelVersion: string;
};

function clamp(num: number, min: number, max: number) {
  return Math.min(max, Math.max(min, num));
}

function bmiFrom(heightCm: number, weightKg: number) {
  const m = heightCm / 100;
  if (!Number.isFinite(m) || m <= 0) return 0;
  const bmi = weightKg / (m * m);
  return Number.isFinite(bmi) ? bmi : 0;
}

function likelihoodFromProbability(p: number): PcosScreening["pcosLikelihood"] {
  if (p >= 0.66) return "likely";
  if (p >= 0.33) return "possible";
  return "unlikely";
}

function fallbackFromRisk(riskScore: "low" | "medium" | "high"): PcosScreening {
  const pcosLikelihood = riskScore === "high" ? "likely" : riskScore === "medium" ? "possible" : "unlikely";
  const pcosProbability = riskScore === "high" ? 0.8 : riskScore === "medium" ? 0.5 : 0.2;
  return {
    pcosLikelihood,
    pcosPossible: pcosLikelihood !== "unlikely",
    pcosProbability,
    modelVersion: "screening-rule-v1",
  };
}

function toModelFeatures(assessment: InsertAssessment) {
  const height_cm = Number(assessment.height);
  const weight_kg = Number(assessment.weight);
  const bmi = bmiFrom(height_cm, weight_kg);

  return {
    age: Number(assessment.age),
    height_cm,
    weight_kg,
    bmi,
    symptom_acne: assessment.symptoms.includes("acne") ? 1 : 0,
    symptom_hair_growth: assessment.symptoms.includes("hair_growth") ? 1 : 0,
    symptom_hair_loss: assessment.symptoms.includes("hair_loss") ? 1 : 0,
    family_history: assessment.familyHistory ? 1 : 0,
    cycle_regularity: assessment.cycleRegularity,
    exercise_frequency: assessment.exerciseFrequency,
    sleep_quality: assessment.sleepQuality,
  };
}

export async function computePcosScreening(assessment: InsertAssessment, riskFallback: "low" | "medium" | "high"): Promise<PcosScreening> {
  try {
    const python = process.env.PCOS_PYTHON || "python";
    const script = process.env.PCOS_PREDICT_SCRIPT || path.join(process.cwd(), "dataset", "predict.py");
    const model = process.env.PCOS_MODEL_PATH || path.join(process.cwd(), "dataset", "pcos_model.joblib");

    const input = JSON.stringify(toModelFeatures(assessment));

    const parsed = await new Promise<any>((resolve, reject) => {
      const child = spawn(python, [script, "--model", model], {
        windowsHide: true,
        stdio: ["pipe", "pipe", "pipe"],
      });

      const timeoutMs = 15_000;
      const killTimer = setTimeout(() => {
        child.kill();
        reject(new Error("PCOS model inference timed out"));
      }, timeoutMs);

      const stdoutChunks: Buffer[] = [];
      const stderrChunks: Buffer[] = [];

      child.stdout.on("data", (d: Buffer) => stdoutChunks.push(d));
      child.stderr.on("data", (d: Buffer) => stderrChunks.push(d));
      child.on("error", (err) => {
        clearTimeout(killTimer);
        reject(err);
      });
      child.on("close", (code) => {
        clearTimeout(killTimer);
        const stdout = Buffer.concat(stdoutChunks).toString("utf-8").trim();
        const stderr = Buffer.concat(stderrChunks).toString("utf-8").trim();
        if (code !== 0) {
          reject(new Error(stderr || `PCOS model inference failed (code ${code ?? "unknown"})`));
          return;
        }
        try {
          resolve(JSON.parse(stdout));
        } catch (e) {
          reject(new Error(`PCOS model returned non-JSON output: ${stdout.slice(0, 200)}`));
        }
      });

      child.stdin.write(input);
      child.stdin.end();
    });

    const prob = clamp(Number(parsed?.pcos_probability), 0, 1);
    const modelVersion = String(parsed?.model_version || "ml-logreg-v1");

    const pcosLikelihood = likelihoodFromProbability(prob);
    return {
      pcosLikelihood,
      pcosPossible: pcosLikelihood !== "unlikely",
      pcosProbability: prob,
      modelVersion,
    };
  } catch {
    return fallbackFromRisk(riskFallback);
  }
}
