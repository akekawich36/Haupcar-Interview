import { Router } from "express";

import carRouter from "./car.routes.js";

const router = Router();

router.use("/cars", carRouter);

export default router;
