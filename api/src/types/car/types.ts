import type { z } from "zod";
import type { Car } from "../../models/car.model.js";
import { carListSchema, createCarSchema } from "./schema.js";

export type CarListQuery = z.output<typeof carListSchema>;
export type CreateCarBody = z.output<typeof createCarSchema>;

export type CreatedCar = Omit<
  ReturnType<Car["get"]>,
  "isDeleted" | "deletedAt"
>;

export type CreateCarResult =
  | { ok: true; car: CreatedCar }
  | { ok: false; reason: "MODEL_BRAND_MISMATCH" | "DUPLICATE_LICENSE_PLATE" };
