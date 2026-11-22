import { Router } from "express";

import {
  getBrandList,
  getModelListByBrand,
} from "../controllers/brand.controller.js";

const brandRouter = Router();

brandRouter.get("/", getBrandList);
brandRouter.get("/:brandId/models", getModelListByBrand);

export default brandRouter;
