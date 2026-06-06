"use client";

import { buildSourceKey } from "@/helpers/buildSourceKey";
import { toggleSource } from "@/services/toggleSource";
import { useRouter } from "next/navigation";

interface PolicyData {
  regionId: number;
  channelId: number;
  notificationTypeId: number;
}
interface ChannelData {
  id: number;
  name: string;
}
interface NotificationTypeData {
  id: number;
  name: string;
}
interface UserSourcesData {
  channelId: number;
  notificationTypeId: number;
}

export default function SourceTable({
  userId,
  channels,
  notificationTypes,
  userSources,
}: {
  userId: number;
  channels: ChannelData[];
  notificationTypes: NotificationTypeData[];
  userSources: UserSourcesData[];
}) {
  const router = useRouter();

  const userSourcesAsSet = new Set(
    userSources.map(({ channelId, notificationTypeId }) => {
      return buildSourceKey(channelId, notificationTypeId);
    }),
  );

  async function toggleUserSource(
    channelId: number,
    notificationTypeId: number,
  ) {
    await toggleSource(userId, channelId, notificationTypeId);
    router.refresh();
    return null;
  }

  return (
    <table className="text-left ">
      <thead>
        <tr>
          <th className="p-2 border"></th>
          {channels.map(channel => {
            return (
              <th key={channel.id} scope="col" className="p-2 border">
                {channel.name}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {notificationTypes.map(notificationType => {
          return (
            <tr key={notificationType.id}>
              <th className="p-2 border">{notificationType.name}</th>
              {channels.map(channel => {
                const pairId = buildSourceKey(channel.id, notificationType.id);
                return (
                  <th className="p-2 border bg-white" key={pairId}>
                    <input
                      type="checkbox"
                      checked={userSourcesAsSet.has(pairId)}
                      onChange={() =>
                        toggleUserSource(channel.id, notificationType.id)
                      }
                    />
                  </th>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
