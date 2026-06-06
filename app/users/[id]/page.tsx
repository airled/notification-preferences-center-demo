import { User, Channel, NotificationType, Source, Region } from "@/models";
import Link from "next/link";
import SourceTable from "./sourceTable";

export const dynamic = 'force-dynamic';

export default async function ShowUser({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await User.findOne({ where: { id }, include: Region });

  if (!user) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans gap-2">
        <div>
          <span>Пользователь не найден</span>
        </div>

        <Link className="bg-gray-200 text-black p-2 rounded" href="/users/list">
          Назад
        </Link>
      </div>
    );
  }

  const channels = await Channel.findAll();
  const notificationTypes = await NotificationType.findAll();
  const userSources = await Source.findAll({ where: { userId: user.id } });

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans gap-2">
      <div>
        <span>
          {user.email} ({user.region.name}, {user.startQuietHours} -{" "}
          {user.endQuietHours})
        </span>
      </div>

      <SourceTable
        userId={user.id}
        channels={channels.map(channel => {
          return { id: channel.id, name: channel.name };
        })}
        notificationTypes={notificationTypes.map(notificationType => {
          return { id: notificationType.id, name: notificationType.name };
        })}
        userSources={userSources.map(source => {
          return {
            channelId: source.channelId,
            notificationTypeId: source.notificationTypeId,
          };
        })}
      />

      <Link className="bg-gray-200 text-black p-2 rounded" href="/users/list">
        Назад
      </Link>
    </div>
  );
}
