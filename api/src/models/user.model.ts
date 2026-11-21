import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../db/sequelize.js";
import * as argon2 from "argon2";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<string>;
  declare email: string;
  declare password: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
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
    tableName: "users",
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.dataValues.password) {
          const password = await argon2.hash(user.dataValues.password, {
            type: argon2.argon2id,
          });
          user.set("password", password);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed("password") && user.dataValues.password) {
          const password = await argon2.hash(user.dataValues.password, {
            type: argon2.argon2id,
          });
          user.set("password", password);
        }
      },
    },
  },
);
