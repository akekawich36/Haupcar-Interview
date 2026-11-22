import { z } from "zod";

export const brandModelsParamsSchema = z.object({
  brandId: z.string().uuid(),
});
