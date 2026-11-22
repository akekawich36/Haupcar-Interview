import { Router } from "express";

import {
  getCarList,
  getCarDetail,
  createCar,
  updateCar,
} from "../controllers/car.controller.js";

const carRouter = Router();

carRouter.get("/", getCarList);
carRouter.post("/", createCar);
carRouter.get("/:id", getCarDetail);
carRouter.put("/:id", updateCar);

export default carRouter;
