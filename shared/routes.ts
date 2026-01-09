import { z } from 'zod';
import { insertAssessmentSchema, assessments } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  assessment: {
    submit: {
      method: 'POST' as const,
      path: '/api/assess-risk',
      input: insertAssessmentSchema,
      responses: {
        200: z.object({
          riskScore: z.enum(["low", "medium", "high"]),
          confidence: z.number(),
          contributingFactors: z.array(z.string()),
          recommendations: z.array(z.string()),
          pcosLikelihood: z.enum(["unlikely", "possible", "likely"]),
          pcosPossible: z.boolean(),
          pcosProbability: z.number(),
          modelVersion: z.string(),
        }),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
