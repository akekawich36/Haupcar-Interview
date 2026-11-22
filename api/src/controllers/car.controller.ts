import type { Request, Response } from "express";

import {
  carListSchema,
  carParamsSchema,
  createCarSchema,
  updateCarSchema,
} from "../types/car/schema.js";
import type { CarWriteFailure } from "../types/car/types.js";
import { validate } from "../utils/validation.js";

// ====== Services ======
import {
  carList,
  carDetail,
  carCreate,
  carUpdate,
} from "../services/car.service.js";

const CAR_ERRORS: Record<
  CarWriteFailure | "NOT_FOUND",
  { status: number; error: string }
> = {
  MODEL_BRAND_MISMATCH: {
    status: 400,
    error: "Model does not belong to the given brand",
  },
  DUPLICATE_LICENSE_PLATE: {
    status: 409,
    error: "Car with this license plate and province already exists",
  },
  NOT_FOUND: {
    status: 404,
    error: "Car not found",
  },
};

export const getCarList = async (req: Request, res: Response) => {
  try {
    const { isValid, data, errors } = validate(carListSchema, req.query);
    if (!isValid) {
      return res
        .status(400)
        .json({ error: "Invalid query parameters", details: errors });
    }

    const cars = await carList(data);
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cars" });
  }
};

export const getCarDetail = async (req: Request, res: Response) => {
  try {
    const { isValid, data, errors } = validate(carParamsSchema, req.params);
    if (!isValid) {
      return res
        .status(400)
        .json({ error: "Invalid path parameters", details: errors });
    }

    const car = await carDetail(data.id);
    if (!car) {
      const { status, error } = CAR_ERRORS.NOT_FOUND;
      return res.status(status).json({ error });
    }

    res.json(car);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch car" });
  }
};

export const createCar = async (req: Request, res: Response) => {
  try {
    const { isValid, data, errors } = validate(createCarSchema, req.body);
    if (!isValid) {
      return res
        .status(400)
        .json({ error: "Invalid request body", details: errors });
    }

    const result = await carCreate(data);
    if (!result.ok) {
      const { status, error } = CAR_ERRORS[result.reason];
      return res.status(status).json({ error });
    }

    res.status(201).json(result.car);
  } catch (error) {
    console.log("🚀 ~ postCar ~ error:", (error as Error).message);
    res.status(500).json({ error: "Failed to create car" });
  }
};

export const updateCar = async (req: Request, res: Response) => {
  try {
    const params = validate(carParamsSchema, req.params);
    if (!params.isValid) {
      return res
        .status(400)
        .json({ error: "Invalid path parameters", details: params.errors });
    }

    const { isValid, data, errors } = validate(updateCarSchema, req.body);
    if (!isValid) {
      return res
        .status(400)
        .json({ error: "Invalid request body", details: errors });
    }

    const result = await carUpdate(params.data.id, data);
    if (!result.ok) {
      const { status, error } = CAR_ERRORS[result.reason];
      return res.status(status).json({ error });
    }

    res.json(result.car);
  } catch (error) {
    res.status(500).json({ error: "Failed to update car" });
  }
};
