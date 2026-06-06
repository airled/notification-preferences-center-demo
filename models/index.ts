"use strict";

import Channel from "./channel";
import DefaultSource from "./defaultSource";
import NotificationType from "./notificationType";
import Policy from "./policy";
import Source from "./source";
import Region from "./region";
import Trace from "./trace";
import User from "./user";

const models = {
  Channel,
  DefaultSource,
  NotificationType,
  Policy,
  Source,
  Region,
  Trace,
  User,
};

Object.values(models).forEach(model => {
  model.associate();
});

export {
  Channel,
  DefaultSource,
  NotificationType,
  Policy,
  Source,
  Region,
  Trace,
  User,
};
