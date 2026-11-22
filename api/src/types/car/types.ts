import type { z } from "zod";
import { carListSchema } from "./schema.js";

export type CarListQuery = z.output<typeof carListSchema>;