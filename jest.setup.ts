import '@testing-library/jest-dom'
import {
  DefaultSource,
  Policy,
  Source,
  User,
  Channel,
  NotificationType,
  Region,
  Trace,
} from "@/models";

afterEach(async () => {
  await Source.destroy({ where: {} });
  await DefaultSource.destroy({ where: {} });
  await Policy.destroy({ where: {} });
  await User.destroy({ where: {} });
  await Channel.destroy({ where: {} });
  await NotificationType.destroy({ where: {} });
  await Region.destroy({ where: {} });
  await Trace.destroy({ where: {} });
});
