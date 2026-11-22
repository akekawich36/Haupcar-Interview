import type { z } from "zod";
import type { Car } from "../../models/car.model.js";
import {
  carListSchema,
  carParamsSchema,
  createCarSchema,
  updateCarSchema,
} from "./schema.js";

export type CarListQuery = z.output<typeof carListSchema>;
export type CreateCarBody = z.output<typeof createCarSchema>;
export type UpdateCarBody = z.output<typeof updateCarSchema>;
export type CarParams = z.output<typeof carParamsSchema>;

export type CreatedCar = Omit<
  ReturnType<Car["get"]>,
  "isDeleted" | "deletedAt"
>;

export type CarWriteFailure = "MODEL_BRAND_MISMATCH" | "DUPLICATE_LICENSE_PLATE";

export type CreateCarResult =
  | { ok: true; car: CreatedCar }
  | { ok: false; reason: CarWriteFailure };

export type UpdateCarResult =
  | { ok: true; car: CreatedCar }
  | { ok: false; reason: CarWriteFailure | "NOT_FOUND" };
