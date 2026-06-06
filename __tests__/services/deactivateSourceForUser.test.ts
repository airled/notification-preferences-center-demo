/**
 * @jest-environment node
 */

import activateSourceForUser from "@/services/activateSourceForUser";
import deactivateSourceForUser from "@/services/deactivateSourceForUser";
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

describe("deactivateSourceForUser", () => {
  it("deletes source on activating", async () => {
    await activateSourceForUser(user, channel, notificationType);
    const sources = await Source.findAll({ where: { userId: user.id } });

    expect(sources.length).toBe(1);
    expect(sources[0].channelId).toBe(channel.id);
    expect(sources[0].notificationTypeId).toBe(notificationType.id);

    await deactivateSourceForUser(user, channel, notificationType);
    expect(await Source.count()).toBe(0);
  });

  it("does nothing on several deactivations for the source", async () => {
    await activateSourceForUser(user, channel, notificationType);
    const sources = await Source.findAll({ where: { userId: user.id } });

    expect(sources.length).toBe(1);
    expect(sources[0].channelId).toBe(channel.id);
    expect(sources[0].notificationTypeId).toBe(notificationType.id);

    await deactivateSourceForUser(user, channel, notificationType);
    await deactivateSourceForUser(user, channel, notificationType);

    expect(await Source.count()).toBe(0);
  });
});
