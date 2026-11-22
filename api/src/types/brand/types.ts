import type { z } from "zod";
import {
  brandParamsSchema,
  modelParamsSchema,
  nameBodySchema,
} from "./schema.js";

export type BrandParams = z.output<typeof brandParamsSchema>;
export type ModelParams = z.output<typeof modelParamsSchema>;
export type NameBody = z.output<typeof nameBodySchema>;

export interface BrandItem {
  id: string;
  name: string;
}

export interface ModelItem {
  id: string;
  name: string;
  brandId: string;
}

export type BrandWriteResult =
  | { ok: true; brand: BrandItem }
  | { ok: false; reason: "NOT_FOUND" | "DUPLICATE_NAME" };

export type ModelWriteResult =
  | { ok: true; model: ModelItem }
  | {
      ok: false;
      reason: "BRAND_NOT_FOUND" | "NOT_FOUND" | "DUPLICATE_NAME";
    };

export type DeleteResult =
  | { ok: true }
  | { ok: false; reason: "NOT_FOUND" | "IN_USE" };
