import { z } from "zod";
import { CAR_STATUSES } from "../../models/car.model.js";

export const carListSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  brandId: z.string().uuid().optional(),
  modelId: z.string().uuid().optional(),
  status: z.enum(CAR_STATUSES).optional(),
});

export const createCarSchema = z.object({
  brandId: z.string().uuid(),
  modelId: z.string().uuid(),
  color: z.string().trim().min(1).max(50),
  licensePlate: z.string().trim().min(1).max(20),
  province: z.string().trim().min(1).max(100),
  note: z.string().trim().nullish(),
});

export const updateCarSchema = createCarSchema.extend({
  status: z.enum(CAR_STATUSES),
});

export const carParamsSchema = z.object({
  id: z.string().uuid(),
});
