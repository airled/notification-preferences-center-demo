"use strict";

import sequelize from "@/config/sequelize";
import { Model, DataTypes } from "sequelize";

class NotificationType extends Model {
  declare id: number;
  declare name: string;

  static associate() {}
}

NotificationType.init(
  {
    name: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: "notification_types",
  },
);

export default NotificationType;
