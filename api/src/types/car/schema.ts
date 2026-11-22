import { z } from "zod";
import { CAR_STATUSES } from "../../models/car.model.js";

export const carListSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  brandId: z.string().uuid().optional(),
  modelId: z.string().uuid().optional(),
  status: z.enum(CAR_STATUSES).optional(),
});
