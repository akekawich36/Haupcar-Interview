import { User } from "./user.model.js";
import { Brand } from "./brand.model.js";
import { CarModel } from "./carModel.model.js";
import { Car } from "./car.model.js";

const models = {
  User,
  Brand,
  CarModel,
  Car,
};

Object.values(models).forEach((model) => {
  if ("associate" in model) {
    model.associate();
  }
});

export default models;
