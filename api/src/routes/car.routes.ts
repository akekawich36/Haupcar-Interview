import { Router } from "express";

import { getCarList, createCar } from "../controllers/car.controller.js";

const carRouter = Router();

carRouter.get("/", getCarList);
carRouter.post("/", createCar);

export default carRouter;
