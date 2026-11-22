import type { z } from "zod";
import { brandModelsParamsSchema } from "./schema.js";

export type BrandModelsParams = z.output<typeof brandModelsParamsSchema>;
