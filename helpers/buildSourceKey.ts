export function buildSourceKey(
  channelId: number,
  notificationTypeId: number,
) {
  return `${channelId}:${notificationTypeId}`;
}
