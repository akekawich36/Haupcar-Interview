// ====== Sequelize ======
import {
  ForeignKeyConstraintError,
  Op,
  UniqueConstraintError,
  col,
  fn,
  literal,
  where as sqlWhere,
} from "sequelize";
import type { WhereOptions } from "sequelize";
import { sequelize } from "../db/sequelize.js";

// ====== Models ======
import { Brand } from "../models/brand.model.js";
import { CarModel } from "../models/carModel.model.js";
import { Car } from "../models/car.model.js";

// ====== Types ======
import type {
  BrandWriteResult,
  DeleteResult,
  ModelWriteResult,
  NameBody,
} from "../types/brand/types.js";

const sameName = (name: string) =>
  sqlWhere(fn("lower", col("name")), name.toLowerCase());

const excludeId = (id?: string): WhereOptions[] =>
  id ? [{ id: { [Op.ne]: id } }] : [];

const isBrandNameTaken = async (name: string, ignoreId?: string) =>
  (await Brand.count({
    where: { [Op.and]: [sameName(name), ...excludeId(ignoreId)] },
  })) > 0;

const isModelNameTaken = async (
  brandId: string,
  name: string,
  ignoreId?: string,
) =>
  (await CarModel.count({
    where: {
      [Op.and]: [{ brandId }, sameName(name), ...excludeId(ignoreId)],
    },
  })) > 0;

const toBrandItem = (brand: Brand) => ({ id: brand.id, name: brand.name });

const toModelItem = (model: CarModel) => ({
  id: model.id,
  name: model.name,
  brandId: model.brandId,
});

export const brandList = async () => {
  const brands = await Brand.findAll({
    attributes: [
      "id",
      "name",
      [
        literal(
          '(SELECT COUNT(*)::int FROM car_models WHERE car_models.brand_id = "Brand"."id")',
        ),
        "modelCount",
      ],
    ],
    order: [["name", "ASC"]],
  });

  return brands.map((brand) => brand.get({ plain: true }));
};

export const brandDetail = async (brandId: string) => {
  const brand = await Brand.findByPk(brandId, { attributes: ["id", "name"] });
  return brand ? toBrandItem(brand) : null;
};

export const brandCreate = async ({
  name,
}: NameBody): Promise<BrandWriteResult> => {
  if (await isBrandNameTaken(name)) {
    return { ok: false, reason: "DUPLICATE_NAME" };
  }

  try {
    const brand = await Brand.create({ name });
    return { ok: true, brand: toBrandItem(brand) };
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return { ok: false, reason: "DUPLICATE_NAME" };
    }
    throw error;
  }
};

export const brandUpdate = async (
  brandId: string,
  { name }: NameBody,
): Promise<BrandWriteResult> => {
  const brand = await Brand.findByPk(brandId);
  if (!brand) {
    return { ok: false, reason: "NOT_FOUND" };
  }

  if (await isBrandNameTaken(name, brandId)) {
    return { ok: false, reason: "DUPLICATE_NAME" };
  }

  try {
    await brand.update({ name });
    return { ok: true, brand: toBrandItem(brand) };
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return { ok: false, reason: "DUPLICATE_NAME" };
    }
    throw error;
  }
};

export const brandDelete = async (brandId: string): Promise<DeleteResult> => {
  const brand = await Brand.findByPk(brandId);
  if (!brand) {
    return { ok: false, reason: "NOT_FOUND" };
  }

  if ((await Car.count({ where: { brandId } })) > 0) {
    return { ok: false, reason: "IN_USE" };
  }

  try {
    await sequelize.transaction(async (transaction) => {
      await CarModel.destroy({ where: { brandId }, transaction });
      await brand.destroy({ transaction });
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      return { ok: false, reason: "IN_USE" };
    }
    throw error;
  }
};

export const modelListByBrand = async (brandId: string) => {
  const brand = await Brand.findByPk(brandId, { attributes: ["id"] });
  if (!brand) {
    return null;
  }

  const models = await CarModel.findAll({
    attributes: ["id", "name", "brandId"],
    where: { brandId },
    order: [["name", "ASC"]],
  });

  return models.map((model) => model.get({ plain: true }));
};

export const modelCreate = async (
  brandId: string,
  { name }: NameBody,
): Promise<ModelWriteResult> => {
  const brand = await Brand.findByPk(brandId, { attributes: ["id"] });
  if (!brand) {
    return { ok: false, reason: "BRAND_NOT_FOUND" };
  }

  if (await isModelNameTaken(brandId, name)) {
    return { ok: false, reason: "DUPLICATE_NAME" };
  }

  const model = await CarModel.create({ brandId, name });
  return { ok: true, model: toModelItem(model) };
};

export const modelUpdate = async (
  brandId: string,
  modelId: string,
  { name }: NameBody,
): Promise<ModelWriteResult> => {
  const model = await CarModel.findOne({ where: { id: modelId, brandId } });
  if (!model) {
    return { ok: false, reason: "NOT_FOUND" };
  }

  if (await isModelNameTaken(brandId, name, modelId)) {
    return { ok: false, reason: "DUPLICATE_NAME" };
  }

  await model.update({ name });
  return { ok: true, model: toModelItem(model) };
};

export const modelDelete = async (
  brandId: string,
  modelId: string,
): Promise<DeleteResult> => {
  const model = await CarModel.findOne({ where: { id: modelId, brandId } });
  if (!model) {
    return { ok: false, reason: "NOT_FOUND" };
  }

  if ((await Car.count({ where: { modelId } })) > 0) {
    return { ok: false, reason: "IN_USE" };
  }

  try {
    await model.destroy();
    return { ok: true };
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      return { ok: false, reason: "IN_USE" };
    }
    throw error;
  }
};
