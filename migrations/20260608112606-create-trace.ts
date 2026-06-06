import { QueryInterface } from "sequelize";

type SequelizeType = typeof import("sequelize");

export async function up(
  queryInterface: QueryInterface,
  Sequelize: SequelizeType,
) {
  await queryInterface.createTable("traces", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    action: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    input: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    output: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });
}

export async function down(
  queryInterface: QueryInterface,
  Sequelize: SequelizeType,
) {
  await queryInterface.dropTable("traces");
}
