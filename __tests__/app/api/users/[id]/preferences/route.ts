/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/users/[id]/preferences/route";
import {
  Channel,
  NotificationType,
  Region,
  Source,
  User,
} from "@/models";

let userId: number;

async function createTestUser() {
  const region = await Region.create({
    name: "testregion",
    timezone: "America/New_York",
  });

  const user = await User.create({
    email: "seeded@example.com",
    regionId: region.id,
    startQuietHours: "22:00",
    endQuietHours: "08:00",
  });
  userId = user.id;
}

describe("GET /api/users/[id]/preferences", () => {
  beforeEach(createTestUser);

  it("returns dashboard and quiet hours", async () => {
    const response = await GET(
      new NextRequest(`http://localhost/api/users/${userId}/preferences`),
      { params: Promise.resolve({ id: String(userId) }) },
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toHaveProperty("dashboard");
    expect(body.data).toHaveProperty("quietHours");
    expect(body.data.quietHours).toEqual({
      start: "22:00",
      end: "08:00",
    });
    expect(body.error).toBeNull();
  });

  it("returns 404 for non-existent user", async () => {
    const response = await GET(
      new NextRequest("http://localhost/api/users/999/preferences"),
      { params: Promise.resolve({ id: "999" }) },
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.data).toBeNull();
    expect(body.error).toBe("User not found");
  });
});

describe("POST /api/users/[id]/preferences", () => {
  beforeEach(createTestUser);

  it("updates quiet hours", async () => {
    const response = await POST(
      new NextRequest(`http://localhost/api/users/${userId}/preferences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startQuietHours: "23:00",
          endQuietHours: "07:00",
        }),
      }),
      { params: Promise.resolve({ id: String(userId) }) },
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toBe("ok");
    expect(body.error).toBeNull();

    const user = await User.findOne({ where: { id: userId } });
    expect(user!.startQuietHours).toBe("23:00");
    expect(user!.endQuietHours).toBe("07:00");
  });

  it("activates a source", async () => {
    const channel = await Channel.create({ name: "testchannel" });
    const notificationType = await NotificationType.create({
      name: "testnotification",
    });

    const response = await POST(
      new NextRequest(`http://localhost/api/users/${userId}/preferences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "testchannel",
          notificationType: "testnotification",
          active: true,
        }),
      }),
      { params: Promise.resolve({ id: String(userId) }) },
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toBe("ok");
    expect(body.error).toBeNull();

    const source = await Source.findOne({
      where: { userId, channelId: channel.id, notificationTypeId: notificationType.id },
    });
    expect(source).not.toBeNull();
  });

  it("returns 404 for non-existent user", async () => {
    const response = await POST(
      new NextRequest("http://localhost/api/users/999/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startQuietHours: "23:00" }),
      }),
      { params: Promise.resolve({ id: "999" }) },
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.data).toBeNull();
    expect(body.error).toBe("User not found");
  });

  it("returns 404 for non-existent channel", async () => {
    const notificationType = await NotificationType.create({
      name: "testnotification",
    });

    const response = await POST(
      new NextRequest(`http://localhost/api/users/${userId}/preferences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "nonexistent",
          notificationType: "testnotification",
          active: true,
        }),
      }),
      { params: Promise.resolve({ id: String(userId) }) },
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.data).toBeNull();
    expect(body.error).toBe("Channel not found");
  });

  it("returns 404 for non-existent notification type", async () => {
    const channel = await Channel.create({ name: "testchannel" });

    const response = await POST(
      new NextRequest(`http://localhost/api/users/${userId}/preferences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "testchannel",
          notificationType: "nonexistent",
          active: true,
        }),
      }),
      { params: Promise.resolve({ id: String(userId) }) },
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.data).toBeNull();
    expect(body.error).toBe("Notification type not found");
  });
});
