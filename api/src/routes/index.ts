import { Router } from "express";

import carRouter from "./car.routes.js";
import brandRouter from "./brand.routes.js";

const router = Router();

router.use("/cars", carRouter);
router.use("/brands", brandRouter);

export default router;
