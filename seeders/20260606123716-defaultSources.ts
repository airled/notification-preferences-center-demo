import { QueryInterface } from "sequelize";
import { Channel, NotificationType } from "../models";

type SequelizeType = typeof import("sequelize");

export async function up(
  queryInterface: QueryInterface,
  Sequelize: SequelizeType,
) {
  const email = (await Channel.findOne({ where: { name: "email" } }))!;
  const push = (await Channel.findOne({ where: { name: "push" } }))!;

  const transactional = (await NotificationType.findOne({
    where: { name: "transactional" },
  }))!;
  const marketing = (await NotificationType.findOne({
    where: { name: "marketing" },
  }))!;

  const dataset = [
    { channelId: email.id, notificationTypeId: transactional.id },
    { channelId: email.id, notificationTypeId: marketing.id },
    { channelId: push.id, notificationTypeId: transactional.id },
  ];

  return queryInterface.bulkInsert("default_sources", dataset);
}

export async function down(
  queryInterface: QueryInterface,
  Sequelize: SequelizeType,
) {
  return queryInterface.bulkDelete("default_sources", {}, {});
}
