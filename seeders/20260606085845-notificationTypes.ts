import { QueryInterface } from "sequelize";

type SequelizeType = typeof import("sequelize");

const NOTIFICATION_TYPES = ["transactional", "marketing"];

export async function up(
  queryInterface: QueryInterface,
  Sequelize: SequelizeType,
) {
  const dataset = NOTIFICATION_TYPES.map(name => { return { name } });
  return queryInterface.bulkInsert("notification_types", dataset);
}

export async function down(
  queryInterface: QueryInterface,
  Sequelize: SequelizeType,
) {
  return queryInterface.bulkDelete("notification_types", {}, {});
}
