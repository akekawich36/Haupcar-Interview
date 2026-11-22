// ====== Sequelize ======
import { Op } from "sequelize";

// ====== Models ======
import { Car } from "../models/car.model.js";

// ====== Types ======
import type { CarListQuery } from "../types/car/types.js";
import { CarModel } from "../models/carModel.model.js";
import { Brand } from "../models/brand.model.js";

export const carList = async (query: CarListQuery) => {
  const { page, limit, brandId, modelId, status } = query;

  const { count, rows } = await Car.findAndCountAll({
    attributes: [
      "id",
      "brandId",
      "modelId",
      "color",
      "licensePlate",
      "status",
      "note",
    ],
    where: {
      ...(brandId && { brandId }),
      ...(modelId && { modelId }),
      ...(status && { status }),
    },
    offset: (page - 1) * limit,
    limit,
    include: [
      {
        model: CarModel,
        required: false,
        attributes: ["name"],
      },
      {
        model: Brand,
        required: false,
        attributes: ["name"],
      },
    ],
  });

  const cars = rows.map((car) => car.get({ plain: true }));
  return {
    items: cars,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  };
};
