import { z } from "zod";

export const brandParamsSchema = z.object({
  brandId: z.string().uuid(),
});

export const modelParamsSchema = brandParamsSchema.extend({
  modelId: z.string().uuid(),
});

export const nameBodySchema = z.object({
  name: z.string().trim().min(1).max(255),
});
