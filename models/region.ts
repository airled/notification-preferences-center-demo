"use strict";

import sequelize from "@/config/sequelize";
import { Model, DataTypes } from "sequelize";

class Region extends Model {
  declare id: number;
  declare name: string;
  declare timezone: string;

  static associate() {}
}

Region.init(
  {
    name: DataTypes.TEXT,
    timezone: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: "regions",
  },
);

export default Region;
