import { QueryInterface } from "sequelize";
import { Channel, NotificationType, Region } from "../models";

type SequelizeType = typeof import("sequelize");

export async function up(
  queryInterface: QueryInterface,
  Sequelize: SequelizeType,
) {
  const eu = (await Region.findOne({ where: { name: "EU" } }))!;
  const usa = (await Region.findOne({ where: { name: "USA" } }))!;
  const russia = (await Region.findOne({ where: { name: "Russia" } }))!;

  const sms = (await Channel.findOne({ where: { name: "sms" } }))!;
  const messengers = (await Channel.findOne({ where: { name: "messenger" } }))!;

  const transactional = (await NotificationType.findOne({
    where: { name: "transactional" },
  }))!;
  const marketing = (await NotificationType.findOne({
    where: { name: "marketing" },
  }))!;

  const dataset = [
    { regionId: eu.id, channelId: sms.id, notificationTypeId: marketing.id },
    { regionId: usa.id, channelId: sms.id, notificationTypeId: marketing.id },
    {
      regionId: russia.id,
      channelId: messengers.id,
      notificationTypeId: marketing.id,
    },
    {
      regionId: russia.id,
      channelId: messengers.id,
      notificationTypeId: transactional.id,
    },
  ];

  return queryInterface.bulkInsert("policies", dataset);
}

export async function down(
  queryInterface: QueryInterface,
  Sequelize: SequelizeType,
) {
  return queryInterface.bulkDelete("policies", {}, {});
}
