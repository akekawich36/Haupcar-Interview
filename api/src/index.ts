import express from "express";
import { sequelize } from "./db/sequelize.js";
import "./models/index.js";

const app = express();
const port = Number(process.env.PORT ?? 8000);

try {
  await sequelize.authenticate();
  await sequelize.sync();

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}
