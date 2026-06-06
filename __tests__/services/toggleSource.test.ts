/**
 * @jest-environment node
 */

import { toggleSource } from "@/services/toggleSource";
import { Channel, NotificationType, Region, Source, User } from "@/models";

let user: User;
let channel: Channel;
let notificationType: NotificationType;

beforeEach(async () => {
  const region = await Region.create({
    name: "testregion",
    timezone: "America/New_York",
  });

  user = await User.create({
    email: "seeded@example.com",
    regionId: region.id,
    startQuietHours: "22:00",
    endQuietHours: "08:00",
  });

  channel = await Channel.create({ name: "testchannel" });
  notificationType = await NotificationType.create({
    name: "testnotificationtype",
  });
});

describe("toggleSource", () => {
  it("creates source if there is no source", async () => {
    expect(await Source.count()).toBe(0);

    await toggleSource(user.id, channel.id, notificationType.id);
    const sources = await Source.findAll({ where: { userId: user.id } });

    expect(sources.length).toBe(1);
    expect(sources[0].channelId).toBe(channel.id);
    expect(sources[0].notificationTypeId).toBe(notificationType.id);
  });

  it("deletes source if there is any", async () => {
    await toggleSource(user.id, channel.id, notificationType.id);

    expect(await Source.count()).toBe(1);

    await toggleSource(user.id, channel.id, notificationType.id);

    expect(await Source.count()).toBe(0);
  });
});
