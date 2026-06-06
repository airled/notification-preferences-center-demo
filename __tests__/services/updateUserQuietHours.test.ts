/**
 * @jest-environment node
 */

import updateUserQuietHours from "@/services/updateUserQuietHours";
import { Region, User } from "@/models";

let user: User;

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
});

describe("updateUserQuietHours", () => {
  it("updates both start and end quiet hours", async () => {
    await updateUserQuietHours(user, "23:00", "07:00");
    await user.reload();

    expect(user.startQuietHours).toBe("23:00");
    expect(user.endQuietHours).toBe("07:00");
  });

  it("updates only start quiet hours when end is not provided", async () => {
    await updateUserQuietHours(user, "20:00");
    await user.reload();

    expect(user.startQuietHours).toBe("20:00");
    expect(user.endQuietHours).toBe("08:00");
  });

  it("updates only end quiet hours when start is not provided", async () => {
    await updateUserQuietHours(user, undefined, "06:00");
    await user.reload();

    expect(user.startQuietHours).toBe("22:00");
    expect(user.endQuietHours).toBe("06:00");
  });

  it("does nothing when neither value is provided", async () => {
    await updateUserQuietHours(user);
    await user.reload();

    expect(user.startQuietHours).toBe("22:00");
    expect(user.endQuietHours).toBe("08:00");
  });
});
