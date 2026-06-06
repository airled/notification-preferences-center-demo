import { buildUserSourcesDashboard } from "@/services/buildUserSourcesDashboard";
import { Channel, NotificationType, Region, Source, User } from "@/models";

describe("buildUserSourcesDashboard", () => {
  let user: User;
  let email: Channel;
  let sms: Channel;
  let marketing: NotificationType;
  let transactional: NotificationType;

  beforeEach(async () => {
    const region = await Region.create({
      name: "US",
      timezone: "America/New_York",
    });
    user = await User.create({
      email: "test@example.com",
      regionId: region.id,
      startQuietHours: "22:00",
      endQuietHours: "08:00",
    });
    email = await Channel.create({ name: "Email" });
    sms = await Channel.create({ name: "SMS" });
    marketing = await NotificationType.create({ name: "Marketing" });
    transactional = await NotificationType.create({ name: "Transactional" });
  });

  it("returns all channel-notificationType combinations regardless of source existing", async () => {
    const result = await buildUserSourcesDashboard(user);

    expect(result.length).toEqual(4);
  });

  it("returns all channel-notificationType pairs with active=false when no sources exist", async () => {
    const result = await buildUserSourcesDashboard(user);

    expect(result).toEqual([
      { channel: "Email", notificationType: "Marketing", active: false },
      { channel: "Email", notificationType: "Transactional", active: false },
      { channel: "SMS", notificationType: "Marketing", active: false },
      { channel: "SMS", notificationType: "Transactional", active: false },
    ]);
  });

  it("marks pairs with sources as active", async () => {
    await Source.create({
      userId: user.id,
      channelId: email.id,
      notificationTypeId: marketing.id,
    });
    await Source.create({
      userId: user.id,
      channelId: sms.id,
      notificationTypeId: transactional.id,
    });

    const result = await buildUserSourcesDashboard(user);

    expect(result).toEqual([
      { channel: "Email", notificationType: "Marketing", active: true },
      { channel: "Email", notificationType: "Transactional", active: false },
      { channel: "SMS", notificationType: "Marketing", active: false },
      { channel: "SMS", notificationType: "Transactional", active: true },
    ]);
  });

  it("does not consider sources belonging to another user", async () => {
    const region = await Region.create({
      name: "EU",
      timezone: "Europe/London",
    });
    const otherUser = await User.create({
      email: "other@example.com",
      regionId: region.id,
      startQuietHours: "22:00",
      endQuietHours: "08:00",
    });

    await Source.create({
      userId: otherUser.id,
      channelId: email.id,
      notificationTypeId: marketing.id,
    });

    const result = await buildUserSourcesDashboard(user);

    const entry = result.find(
      e => e.channel === "Email" && e.notificationType === "Marketing",
    );
    expect(entry?.active).toBe(false);
  });

  it("returns empty array when no channels or notification types exist", async () => {
    await Channel.destroy({ where: {} });
    await NotificationType.destroy({ where: {} });

    const result = await buildUserSourcesDashboard(user);

    expect(result).toEqual([]);
  });
});
