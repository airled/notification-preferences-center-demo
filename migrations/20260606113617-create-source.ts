import { QueryInterface } from "sequelize";

type SequelizeType = typeof import("sequelize");

export async function up(
  queryInterface: QueryInterface,
  Sequelize: SequelizeType,
) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.createTable(
      "sources",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
        },
        channelId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "channels",
            key: "id",
          },
        },
        notificationTypeId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "notification_types",
            key: "id",
          },
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
      },
      { transaction },
    );

    await queryInterface.addIndex("sources", {
      fields: ["userId", "channelId", "notificationTypeId"],
      unique: true,
      transaction,
    });

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

export async function down(
  queryInterface: QueryInterface,
  Sequelize: SequelizeType,
) {
  await queryInterface.dropTable("sources");
}
