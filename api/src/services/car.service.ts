// ====== Sequelize ======
import { Op, UniqueConstraintError } from "sequelize";

// ====== Models ======
import { Car } from "../models/car.model.js";

// ====== Types ======
import type {
  CarListQuery,
  CarWriteFailure,
  CreateCarBody,
  CreateCarResult,
  UpdateCarBody,
  UpdateCarResult,
} from "../types/car/types.js";
import { CarModel } from "../models/carModel.model.js";
import { Brand } from "../models/brand.model.js";

const CAR_ATTRIBUTES = [
  "id",
  "brandId",
  "modelId",
  "color",
  "licensePlate",
  "province",
  "status",
  "note",
];

const CAR_INCLUDES = [
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
];

const checkCarWrite = async (
  body: Pick<CreateCarBody, "brandId" | "modelId" | "licensePlate" | "province">,
  excludeId?: string,
): Promise<CarWriteFailure | null> => {
  const { brandId, modelId, licensePlate, province } = body;

  const model = await CarModel.findOne({
    attributes: ["id"],
    where: { id: modelId, brandId },
  });
  if (!model) {
    return "MODEL_BRAND_MISMATCH";
  }

  const duplicate = await Car.findOne({
    attributes: ["id"],
    where: {
      licensePlate,
      province,
      isDeleted: false,
      ...(excludeId && { id: { [Op.ne]: excludeId } }),
    },
  });
  if (duplicate) {
    return "DUPLICATE_LICENSE_PLATE";
  }

  return null;
};

export const carList = async (query: CarListQuery) => {
  const { page, limit, brandId, modelId, status } = query;

  const { count, rows } = await Car.findAndCountAll({
    attributes: CAR_ATTRIBUTES,
    where: {
      isDeleted: false,
      ...(brandId && { brandId }),
      ...(modelId && { modelId }),
      ...(status && { status }),
    },
    order: [
      ["updatedAt", "DESC"],
      ["id", "ASC"],
    ],
    offset: (page - 1) * limit,
    limit,
    include: CAR_INCLUDES,
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

export const carDetail = async (id: string) => {
  const car = await Car.findOne({
    attributes: [...CAR_ATTRIBUTES, "createdAt", "updatedAt"],
    where: { id, isDeleted: false },
    include: CAR_INCLUDES,
  });

  return car ? car.get({ plain: true }) : null;
};

export const carCreate = async (
  body: CreateCarBody,
): Promise<CreateCarResult> => {
  const { brandId, modelId, color, licensePlate, province, note } = body;

  const failure = await checkCarWrite(body);
  if (failure) {
    return { ok: false, reason: failure };
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

export const carDelete = async (id: string): Promise<boolean> => {
  const [affected] = await Car.update(
    { isDeleted: true, deletedAt: new Date() },
    { where: { id, isDeleted: false } },
  );

  return affected > 0;
};

export const carUpdate = async (
  id: string,
  body: UpdateCarBody,
): Promise<UpdateCarResult> => {
  const { brandId, modelId, color, licensePlate, province, status, note } =
    body;

  const car = await Car.findOne({ where: { id, isDeleted: false } });
  if (!car) {
    return { ok: false, reason: "NOT_FOUND" };
  }

  const failure = await checkCarWrite(body, id);
  if (failure) {
    return { ok: false, reason: failure };
  }

  try {
    await car.update({
      brandId,
      modelId,
      color,
      licensePlate,
      province,
      status,
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
