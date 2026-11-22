import { Router } from "express";

import { getCarList } from "../controllers/car.controller.js";

const carRouter = Router();

carRouter.get("/", getCarList);

export default carRouter;
