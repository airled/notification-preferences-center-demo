import { buildSourceKey } from "@/helpers/buildSourceKey";
import { Channel, NotificationType, Source, User } from "@/models";

export interface DashboardEntry {
  channel: string;
  notificationType: string;
  active: boolean;
}

export async function buildUserSourcesDashboard(
  user: User,
): Promise<DashboardEntry[]> {
  const channels = await Channel.findAll();
  const notificationTypes = await NotificationType.findAll();
  const sources = await Source.findAll({ where: { userId: user.id } });
  const sourcesAsSet = new Set(
    sources.map(({ channelId, notificationTypeId }) => {
      return buildSourceKey(channelId, notificationTypeId);
    }),
  );

  const result: DashboardEntry[] = [];

  channels.forEach(channel => {
    notificationTypes.forEach(notificationType => {
      const pairKey = buildSourceKey(channel.id, notificationType.id);

      const entry = {
        channel: channel.name,
        notificationType: notificationType.name,
        active: sourcesAsSet.has(pairKey),
      };

      result.push(entry);
    });
  });

  return result;
}
