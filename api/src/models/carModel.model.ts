import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../db/sequelize.js";

// ====== Models ======
import { Brand } from "./brand.model.js";

export class CarModel extends Model<
  InferAttributes<CarModel>,
  InferCreationAttributes<CarModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare brandId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static associate() {
    CarModel.belongsTo(Brand, { foreignKey: "brandId" });
  }
}

CarModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    brandId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "car_models",
    timestamps: true,
  },
);
