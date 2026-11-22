import { Brand } from "../models/brand.model.js";
import { CarModel } from "../models/carModel.model.js";

export const brandList = async () => {
  const brands = await Brand.findAll({
    attributes: ["id", "name"],
    order: [["name", "ASC"]],
  });

  return brands.map((brand) => brand.get({ plain: true }));
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
