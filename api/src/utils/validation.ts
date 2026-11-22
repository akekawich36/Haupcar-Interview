import { z } from "zod";

export type ValidationResult<T> =
  | { isValid: true; errors: Record<string, string>; data: T }
  | { isValid: false; errors: Record<string, string>; data?: undefined };

export const validate = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): ValidationResult<T> => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((err) => {
      if (err.path.length > 0) {
        const key = err.path.join(".");
        errors[key] = err.message;
      }
    });
    return { isValid: false, errors };
  }

  return { isValid: true, errors: {}, data: result.data };
};
