import notFoundResponse from "@/helpers/notFoundResponse";
import successResponse from "@/helpers/successResponse";
import { Channel, NotificationType, Region, User } from "@/models";
import activateSourceForUser from "@/services/activateSourceForUser";
import {
  buildUserSourcesDashboard,
  DashboardEntry,
} from "@/services/buildUserSourcesDashboard";
import deactivateSourceForUser from "@/services/deactivateSourceForUser";
import updateUserQuietHours from "@/services/updateUserQuietHours";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface JSONParams {
  channel?: string;
  notificationType?: string;
  active?: boolean;
  startQuietHours?: string;
  endQuietHours?: string;
}

interface PreferencesData {
  dashboard: DashboardEntry[];
  quietHours: { start: string; end: string };
}

interface Result {
  data: PreferencesData | string | null;
  error: string | null;
}

export async function GET(
  req: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<Result>> {
  const { id } = await params;
  const user = await User.findOne({ where: { id }, include: Region });
  if (!user) return notFoundResponse("User");

  const sourcesDashboard = await buildUserSourcesDashboard(user);
  return successResponse<PreferencesData>({
    dashboard: sourcesDashboard,
    quietHours: { start: user.startQuietHours, end: user.endQuietHours },
  });
}

export async function POST(
  req: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<Result>> {
  const { id } = await params;
  const user = await User.findOne({ where: { id }, include: Region });
  if (!user) return notFoundResponse("User");

  const body: JSONParams = await req.json();

  if (body.startQuietHours || body.endQuietHours) {
    await updateUserQuietHours(user, body.startQuietHours, body.endQuietHours);
  }

  if (["channel", "notificationType", "active"].every(key => key in body)) {
    const channel = await Channel.findOne({ where: { name: body.channel } });
    if (!channel) return notFoundResponse("Channel");

    const notificationType = await NotificationType.findOne({
      where: { name: body.notificationType },
    });
    if (!notificationType) return notFoundResponse("Notification type");

    const service = body.active
      ? activateSourceForUser
      : deactivateSourceForUser;
    await service(user, channel, notificationType);
  }

  return successResponse<string>("ok");
}
