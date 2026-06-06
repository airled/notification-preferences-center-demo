import { User } from "@/models";

export default function findHourInUserTimezone(
  user: User,
  datetime: Date,
): number {
  const userTimezone = user.region.timezone;
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: userTimezone,
    hour: "numeric",
    hour12: false,
  });
  return parseInt(formatter.format(new Date(datetime)), 10);
}
