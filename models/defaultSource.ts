"use strict";

import sequelize from "@/config/sequelize";
import { Model, DataTypes } from "sequelize";

class DefaultSource extends Model {
  declare channelId: number;
  declare notificationTypeId: number;

  static associate() {}
}

DefaultSource.init(
  {
    channelId: DataTypes.INTEGER,
    notificationTypeId: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "default_sources",
  },
);

export default DefaultSource;
