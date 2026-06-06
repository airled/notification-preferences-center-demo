"use strict";

import sequelize from "@/config/sequelize";
import { Model, DataTypes } from "sequelize";

class Policy extends Model {
  declare regionId: number;
  declare channelId: number;
  declare notificationTypeId: number;

  static associate() {}
}

Policy.init(
  {
    regionId: DataTypes.INTEGER,
    channelId: DataTypes.INTEGER,
    notificationTypeId: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "policies",
  },
);

export default Policy;
