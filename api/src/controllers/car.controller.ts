import type { Request, Response } from "express";

import { carListSchema, createCarSchema } from "../types/car/schema.js";
import { validate } from "../utils/validation.js";

// ====== Services ======
import { carList, carCreate } from "../services/car.service.js";

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
      if (result.reason === "DUPLICATE_LICENSE_PLATE") {
        return res.status(409).json({
          error: "Car with this license plate and province already exists",
        });
      }
      return res
        .status(400)
        .json({ error: "Model does not belong to the given brand" });
    }

    res.status(201).json(result.car);
  } catch (error) {
    console.log("🚀 ~ postCar ~ error:", (error as Error).message);
    res.status(500).json({ error: "Failed to create car" });
  }
};
