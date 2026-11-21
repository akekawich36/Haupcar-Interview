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
import { CarModel } from "./carModel.model.js";

const CAR_STATUSES = ["available", "rented", "reserved"] as const;
type CarStatus = (typeof CAR_STATUSES)[number];

export class Car extends Model<
  InferAttributes<Car>,
  InferCreationAttributes<Car>
> {
  declare id: CreationOptional<string>;
  declare brandId: string;
  declare modelId: string;
  declare color: string;
  declare licensePlate: string;
  declare status: CreationOptional<CarStatus>;
  declare note: CreationOptional<string | null>;
  declare isDeleted: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date | null>;

  static associate() {
    Car.belongsTo(Brand, { foreignKey: "brandId", onDelete: "RESTRICT" });
    Car.belongsTo(CarModel, { foreignKey: "modelId", onDelete: "RESTRICT" });
  }
}

Car.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    brandId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    modelId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    licensePlate: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...CAR_STATUSES),
      defaultValue: "available",
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "cars",
    timestamps: true,
  },
);
