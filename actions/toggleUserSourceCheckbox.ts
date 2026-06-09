"use server";

import { toggleSource } from "@/services/toggleSource";

export async function toggleUserSourceCheckbox(
  userId: number,
  channelId: number,
  notificationTypeId: number,
) {
  await toggleSource(userId, channelId, notificationTypeId);
  return { status: "ok" };
}
