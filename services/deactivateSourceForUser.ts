import sequelize from "@/config/sequelize";
import { User, Source, Channel, NotificationType, Trace } from "@/models";

export default async function deactivateSourceForUser(
  user: User,
  channel: Channel,
  notificationType: NotificationType,
) {
  const transaction = await sequelize.transaction();
  try {
    const sourceParams = {
      userId: user.id,
      channelId: channel.id,
      notificationTypeId: notificationType.id,
    };

    const destroyCount = await Source.destroy({
      where: sourceParams,
      transaction,
    });

    await Trace.create(
      {
        action: "deactivateSourceForUser",
        input: JSON.stringify(sourceParams),
        output: JSON.stringify({ count: destroyCount }),
      },
      { transaction },
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
