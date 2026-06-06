"use strict";

import sequelize from "@/config/sequelize";
import { Model, DataTypes } from "sequelize";
import Region from "./region";

class User extends Model {
  declare id: number;
  declare regionId: number;
  declare email: string;
  declare startQuietHours: string;
  declare endQuietHours: string;
  declare region: Region;

  static associate() {
    this.belongsTo(Region);
  }
}

User.init(
  {
    regionId: DataTypes.INTEGER,
    email: DataTypes.TEXT,
    startQuietHours: DataTypes.TIME,
    endQuietHours: DataTypes.TIME,
  },
  {
    sequelize,
    modelName: "users",
  },
);

export default User;
