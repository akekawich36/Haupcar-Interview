import { Router } from "express";

import {
  getCarList,
  getCarDetail,
  createCar,
  updateCar,
  deleteCar,
} from "../controllers/car.controller.js";

const carRouter = Router();

carRouter.get("/", getCarList);
carRouter.post("/", createCar);
carRouter.get("/:id", getCarDetail);
carRouter.put("/:id", updateCar);
carRouter.delete("/:id", deleteCar);

export default carRouter;
