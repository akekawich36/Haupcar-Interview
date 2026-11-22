import type { Request, Response } from "express";

import { carListSchema } from "../types/car/schema.js";
import { validate } from "../utils/validation.js";

// ====== Services ======
import { carList } from "../services/car.service.js";

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
