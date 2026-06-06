"use strict";

import { Sequelize } from "sequelize";
import config from "../config/config.json";

const env = process.env.NODE_ENV || "development";
const envConfig = (config as any)[env];

const options: any = { ...envConfig };
if (envConfig.dialect === "postgres") {
  options.dialectModule = require("pg");
}

if (envConfig.dialect === 'sqlite') {
  options.dialectModule = require("sqlite3");
}

const sequelize = new Sequelize(
  envConfig.database,
  envConfig.username,
  envConfig.password,
  options,
);

export default sequelize;
