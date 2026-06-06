import notFoundResponse from "@/helpers/notFoundResponse";
import successResponse from "@/helpers/successResponse";
import { Channel, NotificationType, Region, User } from "@/models";
import AllowanceChecker, { type Evaluation } from "@/services/allowanceChecker";
import { NextRequest, NextResponse } from "next/server";

interface JSONParams {
  userId: string | number;
  channel: string;
  notificationType: string;
  region: string;
  datetime: string;
}

interface Result {
  data: Evaluation | null;
  error: string | null;
}

export async function POST(req: NextRequest): Promise<NextResponse<Result>> {
  const body: JSONParams = await req.json();
  const {
    userId,
    channel: channelName,
    notificationType: notificationTypeName,
    region: regionName,
    datetime,
  } = body;

  const user = await User.findOne({ where: { id: userId }, include: Region });
  if (!user) return notFoundResponse("User");

  const channel = await Channel.findOne({ where: { name: channelName } });
  if (!channel) return notFoundResponse("Channel");

  const notificationType = await NotificationType.findOne({
    where: { name: notificationTypeName },
  });
  if (!notificationType) return notFoundResponse("Notification type");

  const region = await Region.findOne({ where: { name: regionName } });
  if (!region) return notFoundResponse("Region");

  const allowanceChecker = new AllowanceChecker({
    user,
    channel,
    notificationType,
    region,
    datetime,
  });
  const evaluation = await allowanceChecker.check();
  return successResponse<Evaluation>(evaluation);
}
