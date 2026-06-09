import { Channel, NotificationType, Source, User } from "@/models";
import deactivateSourceForUser from "./deactivateSourceForUser";
import activateSourceForUser from "./activateSourceForUser";

export async function toggleSource(
  userId: number,
  channelId: number,
  notificationTypeId: number,
) {
  const sourceParams = { userId, channelId, notificationTypeId };
  const user = await User.findOne({ where: { id: userId } });
  if (!user) return { status: "user not found" };

  const channel = await Channel.findOne({ where: { id: channelId } });
  if (!channel) return { status: "channel not found" };

  const notificationType = await NotificationType.findOne({
    where: { id: notificationTypeId },
  });
  if (!notificationType) return { status: "notification type not found" };

  const source = await Source.findOne({ where: sourceParams });

  if (source) {
    await deactivateSourceForUser(user, channel, notificationType);
  } else {
    await activateSourceForUser(user, channel, notificationType);
  }

  return { status: "ok" };
}
