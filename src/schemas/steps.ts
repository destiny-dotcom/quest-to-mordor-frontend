import { z } from "zod";

export const logStepsSchema = z.object({
  step_count: z
    .number()
    .int("Steps must be a whole number")
    .min(1, "Steps must be at least 1")
    .max(200000, "Steps cannot exceed 200,000"),
  recorded_date: z.string().refine((date) => {
    const parsed = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return parsed <= today;
  }, "Date cannot be in the future"),
});

export type LogStepsFormData = z.infer<typeof logStepsSchema>;
