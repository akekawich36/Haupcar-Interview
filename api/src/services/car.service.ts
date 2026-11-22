// ====== Sequelize ======
import { Op, UniqueConstraintError } from "sequelize";

// ====== Models ======
import { Car } from "../models/car.model.js";

// ====== Types ======
import type {
  CarListQuery,
  CreateCarBody,
  CreateCarResult,
} from "../types/car/types.js";
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
      "province",
      "status",
      "note",
    ],
    where: {
      ...(brandId && { brandId }),
      ...(modelId && { modelId }),
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

export const carCreate = async (
  body: CreateCarBody,
): Promise<CreateCarResult> => {
  const { brandId, modelId, color, licensePlate, province, note } = body;

  const model = await CarModel.findOne({
    attributes: ["id"],
    where: { id: modelId, brandId },
  });
  if (!model) {
    return { ok: false, reason: "MODEL_BRAND_MISMATCH" };
  }

  const duplicate = await Car.findOne({
    attributes: ["id"],
    where: { licensePlate, province, isDeleted: false },
  });
  if (duplicate) {
    return { ok: false, reason: "DUPLICATE_LICENSE_PLATE" };
  }

  try {
    const car = await Car.create({
      brandId,
      modelId,
      color,
      licensePlate,
      province,
      note: note ?? null,
    });

    const { isDeleted, deletedAt, ...result } = car.get({ plain: true });
    return { ok: true, car: result };
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return { ok: false, reason: "DUPLICATE_LICENSE_PLATE" };
    }
    throw error;
  }
};
