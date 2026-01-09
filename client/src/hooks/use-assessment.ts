import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

type AssessmentInput = z.infer<typeof api.assessment.submit.input>;
type AssessmentResponse = z.infer<typeof api.assessment.submit.responses[200]>;

export function useSubmitAssessment() {
  return useMutation<AssessmentResponse, Error, AssessmentInput>({
    mutationFn: async (data) => {
      // Zod coercion happens here if needed, but form libraries usually handle types well
      // For this schema, we might need to ensure numbers are numbers
      const payload = {
        ...data,
        age: Number(data.age),
        height: Number(data.height),
        weight: Number(data.weight),
        // Arrays and enums pass through as-is
      };

      const validated = api.assessment.submit.input.parse(payload);
      
      const res = await fetch(api.assessment.submit.path, {
        method: api.assessment.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to submit assessment");
      }

      const result = await res.json();
      return api.assessment.submit.responses[200].parse(result);
    },
  });
}
