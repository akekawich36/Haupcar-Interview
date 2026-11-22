import type { Request, Response } from "express";

import {
  brandParamsSchema,
  modelParamsSchema,
  nameBodySchema,
} from "../types/brand/schema.js";
import { validate } from "../utils/validation.js";

import {
  brandList,
  brandDetail,
  brandCreate,
  brandUpdate,
  brandDelete,
  modelListByBrand,
  modelCreate,
  modelUpdate,
  modelDelete,
} from "../services/brand.service.js";

type ErrorMap<T extends string> = Record<T, { status: number; error: string }>;

const BRAND_ERRORS: ErrorMap<"NOT_FOUND" | "DUPLICATE_NAME" | "IN_USE"> = {
  NOT_FOUND: { status: 404, error: "Brand not found" },
  DUPLICATE_NAME: { status: 409, error: "Brand with this name already exists" },
  IN_USE: {
    status: 409,
    error: "Brand is used by one or more cars and cannot be deleted",
  },
};

const MODEL_ERRORS: ErrorMap<
  "BRAND_NOT_FOUND" | "NOT_FOUND" | "DUPLICATE_NAME" | "IN_USE"
> = {
  BRAND_NOT_FOUND: { status: 404, error: "Brand not found" },
  NOT_FOUND: { status: 404, error: "Model not found" },
  DUPLICATE_NAME: {
    status: 409,
    error: "Model with this name already exists for this brand",
  },
  IN_USE: {
    status: 409,
    error: "Model is used by one or more cars and cannot be deleted",
  },
};

const sendError = (
  res: Response,
  { status, error }: { status: number; error: string },
) => res.status(status).json({ error });

const invalidParams = (res: Response, details: Record<string, string>) =>
  res.status(400).json({ error: "Invalid path parameters", details });

const invalidBody = (res: Response, details: Record<string, string>) =>
  res.status(400).json({ error: "Invalid request body", details });

export const getBrandList = async (_req: Request, res: Response) => {
  try {
    const brands = await brandList();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch brands" });
  }
};

export const getBrandDetail = async (req: Request, res: Response) => {
  try {
    const params = validate(brandParamsSchema, req.params);
    if (!params.isValid) return invalidParams(res, params.errors);

    const brand = await brandDetail(params.data.brandId);
    if (!brand) return sendError(res, BRAND_ERRORS.NOT_FOUND);

    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch brand" });
  }
};

export const createBrand = async (req: Request, res: Response) => {
  try {
    const body = validate(nameBodySchema, req.body);
    if (!body.isValid) return invalidBody(res, body.errors);

    const result = await brandCreate(body.data);
    if (!result.ok) return sendError(res, BRAND_ERRORS[result.reason]);

    res.status(201).json(result.brand);
  } catch (error) {
    res.status(500).json({ error: "Failed to create brand" });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  try {
    const params = validate(brandParamsSchema, req.params);
    if (!params.isValid) return invalidParams(res, params.errors);

    const body = validate(nameBodySchema, req.body);
    if (!body.isValid) return invalidBody(res, body.errors);

    const result = await brandUpdate(params.data.brandId, body.data);
    if (!result.ok) return sendError(res, BRAND_ERRORS[result.reason]);

    res.json(result.brand);
  } catch (error) {
    res.status(500).json({ error: "Failed to update brand" });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const params = validate(brandParamsSchema, req.params);
    if (!params.isValid) return invalidParams(res, params.errors);

    const result = await brandDelete(params.data.brandId);
    if (!result.ok) return sendError(res, BRAND_ERRORS[result.reason]);

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete brand" });
  }
};

export const getModelListByBrand = async (req: Request, res: Response) => {
  try {
    const params = validate(brandParamsSchema, req.params);
    if (!params.isValid) return invalidParams(res, params.errors);

    const models = await modelListByBrand(params.data.brandId);
    if (!models) return sendError(res, BRAND_ERRORS.NOT_FOUND);

    res.json(models);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch models" });
  }
};

export const createModel = async (req: Request, res: Response) => {
  try {
    const params = validate(brandParamsSchema, req.params);
    if (!params.isValid) return invalidParams(res, params.errors);

    const body = validate(nameBodySchema, req.body);
    if (!body.isValid) return invalidBody(res, body.errors);

    const result = await modelCreate(params.data.brandId, body.data);
    if (!result.ok) return sendError(res, MODEL_ERRORS[result.reason]);

    res.status(201).json(result.model);
  } catch (error) {
    res.status(500).json({ error: "Failed to create model" });
  }
};

export const updateModel = async (req: Request, res: Response) => {
  try {
    const params = validate(modelParamsSchema, req.params);
    if (!params.isValid) return invalidParams(res, params.errors);

    const body = validate(nameBodySchema, req.body);
    if (!body.isValid) return invalidBody(res, body.errors);

    const { brandId, modelId } = params.data;
    const result = await modelUpdate(brandId, modelId, body.data);
    if (!result.ok) return sendError(res, MODEL_ERRORS[result.reason]);

    res.json(result.model);
  } catch (error) {
    res.status(500).json({ error: "Failed to update model" });
  }
};

export const deleteModel = async (req: Request, res: Response) => {
  try {
    const params = validate(modelParamsSchema, req.params);
    if (!params.isValid) return invalidParams(res, params.errors);

    const { brandId, modelId } = params.data;
    const result = await modelDelete(brandId, modelId);
    if (!result.ok) return sendError(res, MODEL_ERRORS[result.reason]);

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete model" });
  }
};
