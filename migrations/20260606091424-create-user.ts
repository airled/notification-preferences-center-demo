import { QueryInterface } from "sequelize";

type SequelizeType = typeof import("sequelize");

export async function up(
  queryInterface: QueryInterface,
  Sequelize: SequelizeType,
) {
  await queryInterface.createTable("users", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    regionId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "regions",
        key: "id",
      },
    },
    email: {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    startQuietHours: {
      allowNull: false,
      type: Sequelize.TIME,
      defaultValue: "22:00",
    },
    endQuietHours: {
      allowNull: false,
      type: Sequelize.TIME,
      defaultValue: "08:00",
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
  await queryInterface.dropTable("users");
}
