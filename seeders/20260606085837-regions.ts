import { QueryInterface } from "sequelize";

type SequelizeType = typeof import("sequelize");

const REGIONS = [
  ["EU", "Europe/London"],
  ["USA", "America/New_York"],
  ["Russia", "Europe/Moscow"],
];

export async function up(
  queryInterface: QueryInterface,
  Sequelize: SequelizeType,
) {
  const dataset = REGIONS.map(([name, timezone]) => {
    return { name, timezone };
  });
  return queryInterface.bulkInsert("regions", dataset);
}
export async function down(
  queryInterface: QueryInterface,
  Sequelize: SequelizeType,
) {
  return queryInterface.bulkDelete("regions", {}, {});
}
