/**
 * @jest-environment node
 */

import AllowanceChecker from "@/services/allowanceChecker";
import {
  Channel,
  NotificationType,
  Policy,
  Region,
  Source,
  User,
} from "@/models";

let region: Region;
let user: User;
let email: Channel;
let marketing: NotificationType;
let transactional: NotificationType;

beforeEach(async () => {
  region = await Region.create({
    name: "testregion",
    timezone: "America/New_York",
  });
  user = await User.create({
    email: "test@example.com",
    regionId: region.id,
    startQuietHours: "22:00",
    endQuietHours: "08:00",
  });
  user.region = region;
  email = await Channel.create({ name: "Email" });
  marketing = await NotificationType.create({ name: "marketing" });
  transactional = await NotificationType.create({
    name: "transactional",
  });
});

describe("AllowanceChecker", () => {
  describe("policy check", () => {
    it("denies when a policy blocks the combination", async () => {
      await Policy.create({
        regionId: region.id,
        channelId: email.id,
        notificationTypeId: marketing.id,
      });

      const checker = new AllowanceChecker({
        user,
        channel: email,
        notificationType: marketing,
        region,
        datetime: "2026-06-08T14:00:00-04:00",
      });

      const result = await checker.check();
      expect(result).toEqual({
        decision: "deny",
        reason: "blocked_by_global_policy",
      });
    });

    it("allows when no policy blocks the combination", async () => {
      await Source.create({
        userId: user.id,
        channelId: email.id,
        notificationTypeId: transactional.id,
      });

      const checker = new AllowanceChecker({
        user,
        channel: email,
        notificationType: transactional,
        region,
        datetime: "2026-06-08T14:00:00-04:00",
      });

      const result = await checker.check();
      expect(result.decision).toBe("allow");
    });
  });

  describe("quiet hours check", () => {
    it("denies marketing notifications during quiet hours", async () => {
      const checker = new AllowanceChecker({
        user,
        channel: email,
        notificationType: marketing,
        region,
        datetime: "2026-06-08T23:00:00-04:00",
      });

      const result = await checker.check();
      expect(result).toEqual({
        decision: "deny",
        reason: "blocked_by_quiet_hours",
      });
    });

    it("allows marketing notifications outside quiet hours", async () => {
      await Source.create({
        userId: user.id,
        channelId: email.id,
        notificationTypeId: marketing.id,
      });

      const checker = new AllowanceChecker({
        user,
        channel: email,
        notificationType: marketing,
        region,
        datetime: "2026-06-08T14:00:00-04:00",
      });

      const result = await checker.check();
      expect(result.decision).toBe("allow");
    });

    it("allows non-marketing notifications regardless of time", async () => {
      await Source.create({
        userId: user.id,
        channelId: email.id,
        notificationTypeId: transactional.id,
      });

      const checker = new AllowanceChecker({
        user,
        channel: email,
        notificationType: transactional,
        region,
        datetime: "2026-06-08T23:00:00-04:00",
      });

      const result = await checker.check();
      expect(result.decision).toBe("allow");
    });
  });

  describe("source check", () => {
    it("denies when no source exists for the combination", async () => {
      const checker = new AllowanceChecker({
        user,
        channel: email,
        notificationType: transactional,
        region,
        datetime: "2026-06-08T14:00:00-04:00",
      });

      const result = await checker.check();
      expect(result).toEqual({
        decision: "deny",
        reason: "blocked_by_channel_and_notification_type",
      });
    });
  });
});
