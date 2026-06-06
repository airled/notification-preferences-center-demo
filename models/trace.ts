"use strict";

import sequelize from "@/config/sequelize";
import { Model, DataTypes } from "sequelize";

class Trace extends Model {
  declare id: number;
  declare action: string;
  declare input: string;
  declare output: string;

  static associate() {}
}

Trace.init(
  {
    action: DataTypes.TEXT,
    input: DataTypes.TEXT,
    output: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: "traces",
  },
);

export default Trace;
