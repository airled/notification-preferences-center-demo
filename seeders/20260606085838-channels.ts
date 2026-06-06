import { QueryInterface } from "sequelize";

type SequelizeType = typeof import("sequelize");

const CHANNELS = ["sms", "email", "messenger", "push"];

export async function up(
  queryInterface: QueryInterface,
  Sequelize: SequelizeType,
) {
  const dataset = CHANNELS.map(name => { return { name } });
  return queryInterface.bulkInsert("channels", dataset);
}

export async function down(
  queryInterface: QueryInterface,
  Sequelize: SequelizeType,
) {
  return queryInterface.bulkDelete("channels", {}, {});
}
