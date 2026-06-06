"use strict";

import sequelize from "@/config/sequelize";
import { Model, DataTypes } from "sequelize";

class Source extends Model {
  declare id: number;
  declare userId: number;
  declare channelId: number;
  declare notificationTypeId: number;

  static associate() {}
}

Source.init(
  {
    userId: DataTypes.INTEGER,
    channelId: DataTypes.INTEGER,
    notificationTypeId: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "sources",
  },
);

export default Source;
