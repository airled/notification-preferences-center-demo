import sequelize from "@/config/sequelize";
import { User, Source, Channel, NotificationType, Trace } from "@/models";

export default async function activateSourceForUser(
  user: User,
  channel: Channel,
  notificationType: NotificationType,
) {
  const createParams = {
    userId: user.id,
    channelId: channel.id,
    notificationTypeId: notificationType.id,
  };

  const transaction = await sequelize.transaction();
  try {
    const [source, created] = await Source.findOrCreate({
      where: createParams,
      transaction,
    });

    await Trace.create(
      {
        action: "activateSourceForUser",
        input: JSON.stringify(createParams),
        output: JSON.stringify({ id: source.id }),
      },
      { transaction },
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
