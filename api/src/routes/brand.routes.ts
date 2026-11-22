import { Router } from "express";

import {
  getBrandList,
  getBrandDetail,
  createBrand,
  updateBrand,
  deleteBrand,
  getModelListByBrand,
  createModel,
  updateModel,
  deleteModel,
} from "../controllers/brand.controller.js";

const brandRouter = Router();

brandRouter.get("/", getBrandList);
brandRouter.post("/", createBrand);
brandRouter.get("/:brandId", getBrandDetail);
brandRouter.put("/:brandId", updateBrand);
brandRouter.delete("/:brandId", deleteBrand);

brandRouter.get("/:brandId/models", getModelListByBrand);
brandRouter.post("/:brandId/models", createModel);
brandRouter.put("/:brandId/models/:modelId", updateModel);
brandRouter.delete("/:brandId/models/:modelId", deleteModel);

export default brandRouter;
