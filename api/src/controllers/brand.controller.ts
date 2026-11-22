import type { Request, Response } from "express";

import { brandModelsParamsSchema } from "../types/brand/schema.js";
import { validate } from "../utils/validation.js";

import { brandList, modelListByBrand } from "../services/brand.service.js";

export const getBrandList = async (_req: Request, res: Response) => {
  try {
    const brands = await brandList();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch brands" });
  }
};

export const getModelListByBrand = async (req: Request, res: Response) => {
  try {
    const { isValid, data, errors } = validate(
      brandModelsParamsSchema,
      req.params,
    );
    if (!isValid) {
      return res
        .status(400)
        .json({ error: "Invalid path parameters", details: errors });
    }

    const models = await modelListByBrand(data.brandId);
    if (!models) {
      return res.status(404).json({ error: "Brand not found" });
    }

    res.json(models);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch models" });
  }
};
