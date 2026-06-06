"use strict";

import sequelize from "@/config/sequelize";
import { Model, DataTypes } from "sequelize";

class Channel extends Model {
  declare id: number;
  declare name: string;

  static associate() {}
}

Channel.init(
  {
    name: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: "channels",
  },
);

export default Channel;
