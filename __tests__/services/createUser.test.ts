/**
 * @jest-environment node
 */

import { createUser } from "@/services/createUser";
import {
  Channel,
  DefaultSource,
  NotificationType,
  Region,
  Source,
  User,
} from "@/models";

let region: Region;
let push: Channel;
let sms: Channel;
let marketing: NotificationType;
let transactional: NotificationType;

beforeEach(async () => {
  region = await Region.create({
    name: "testregion",
    timezone: "America/New_York",
  });

  push = await Channel.create({ name: "push" });
  sms = await Channel.create({ name: "sms" });
  marketing = await NotificationType.create({
    name: "marketing",
  });
  transactional = await NotificationType.create({
    name: "transactional",
  });

  const defaultSourcesCombinations = [
    [sms, marketing],
    [push, transactional],
  ];

  for (const [channel, notificationType] of defaultSourcesCombinations) {
    await DefaultSource.create({
      channelId: channel.id,
      notificationTypeId: notificationType.id,
    });
  }
});

describe("createUser", () => {
  it("creates new user", async () => {
    expect(await User.count()).toBe(0);

    const formData = new FormData();
    formData.set("regionId", String(region.id));
    formData.set("email", "test@example.com");
    formData.set("startQuietHours", "22:00");
    formData.set("endQuietHours", "08:00");
    await createUser(formData);

    const user = await User.findOne({
      where: { email: "test@example.com" },
    });
    expect(user).not.toBeNull();
    expect(user!.regionId).toBe(region.id);
    expect(user!.startQuietHours).toBe("22:00");
    expect(user!.endQuietHours).toBe("08:00");
  });

  it("creates default sources for new user", async () => {
    expect(await User.count()).toBe(0);

    const formData = new FormData();
    formData.set("regionId", String(region.id));
    formData.set("email", "test@example.com");
    formData.set("startQuietHours", "22:00");
    formData.set("endQuietHours", "08:00");
    await createUser(formData);

    const user = await User.findOne({
      where: { email: "test@example.com" },
    });

    const sources = await Source.findAll({
      where: { userId: user!.id },
    });
    const smsMarketing = await Source.findOne({
      where: {
        userId: user!.id,
        channelId: sms.id,
        notificationTypeId: marketing.id,
      },
    });
    const pushTransactional = await Source.findOne({
      where: {
        userId: user!.id,
        channelId: push.id,
        notificationTypeId: transactional.id,
      },
    });

    expect(sources).toHaveLength(2);
    expect(smsMarketing).not.toBeNull();
    expect(pushTransactional).not.toBeNull();
  });
});
