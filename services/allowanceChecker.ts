import findHourInUserTimezone from "@/helpers/findHourInUserTimezone";
import {
  Channel,
  NotificationType,
  Policy,
  Region,
  Source,
  Trace,
  User,
} from "@/models";

interface EvaluationOpts {
  user: User;
  channel: Channel;
  notificationType: NotificationType;
  region: Region;
  datetime: string;
}

export interface Evaluation {
  decision: "allow" | "deny";
  reason: string;
}

export default class AllowanceChecker {
  user: User;
  channel: Channel;
  notificationType: NotificationType;
  region: Region;
  datetime: string;
  input: Record<string, number | string>;

  constructor({
    user,
    channel,
    notificationType,
    region,
    datetime,
  }: EvaluationOpts) {
    this.user = user;
    this.channel = channel;
    this.notificationType = notificationType;
    this.region = region;
    this.datetime = datetime;
    this.input = {
      userId: user.id,
      channelId: channel.id,
      notificationTypeId: notificationType.id,
      regionId: region.id,
      datetime,
    };
  }

  async check(): Promise<Evaluation> {
    const evaluation = (await this.checkPolicy()) ||
      (await this.checkQuietHours()) ||
      (await this.checkSource()) || { decision: "allow", reason: "" };

    await Trace.create({
      action: "evaluate",
      input: JSON.stringify(this.input),
      output: JSON.stringify(evaluation),
    });
    return evaluation;
  }

  private async checkPolicy(): Promise<Evaluation | null> {
    const policy = await Policy.findOne({
      where: {
        regionId: this.region.id,
        channelId: this.channel.id,
        notificationTypeId: this.notificationType.id,
      },
    });
    if (!policy) return null;

    return {
      decision: "deny",
      reason: "blocked_by_global_policy",
    };
  }

  private async checkQuietHours(): Promise<Evaluation | null> {
    if (this.notificationType.name !== "marketing") return null;

    const hourInUserTimezone = findHourInUserTimezone(
      this.user,
      new Date(this.datetime),
    );

    const [startHour] = this.user.startQuietHours.split(":");
    const [endHour] = this.user.endQuietHours.split(":");
    const userStartHour = parseInt(startHour, 10);
    const userEndHour = parseInt(endHour, 10);

    // there is no quiet hours, just allow
    if (userStartHour === userEndHour) return null;

    let blocked = false;
    // for cases when quiet hours are like 08:00-22:00
    // blocked hours are in range [8..22)
    if (userStartHour < userEndHour) {
      blocked =
        userStartHour <= hourInUserTimezone && hourInUserTimezone < userEndHour;
      // for cases when quiet hours are like 22:00-08:00,
      // blocked hours are in ranges [22:00..] and [..08:00)
    } else {
      blocked =
        userStartHour <= hourInUserTimezone || hourInUserTimezone < userEndHour;
    }
    if (!blocked) return null;

    return {
      decision: "deny",
      reason: "blocked_by_quiet_hours",
    };
  }

  private async checkSource(): Promise<Evaluation | null> {
    const source = await Source.findOne({
      where: {
        userId: this.user.id,
        channelId: this.channel.id,
        notificationTypeId: this.notificationType.id,
      },
    });
    if (source) return null;

    return {
      decision: "deny",
      reason: "blocked_by_channel_and_notification_type",
    };
  }
}
