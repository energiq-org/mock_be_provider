import winston from "winston";

import config from "../config/env.ts";

// npm debug levels (winston default):
// {
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3
//   verbose: 4,
//   debug: 5,
//   silly: 6
// }

const prettyJson = winston.format.printf((info) => {
  if (typeof info.message === "object" && info.message !== null && info.message.constructor === Object) {
    info.message = JSON.stringify(info.message, null, 4);
  }
  return `${info.timestamp as string} ${(info.label as string) || "-"} ${info.level}: ${info.message as string}`;
});

const logger = winston.createLogger({
  level: config.LOGGING_LEVEL === "silent" ? undefined : config.LOGGING_LEVEL,
  silent: config.LOGGING_LEVEL === "silent",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.prettyPrint(),
    winston.format.splat(),
    winston.format.simple(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    prettyJson
  ),
  defaultMeta: { service: "api-example" },
  transports: [new winston.transports.Console({})],
});

export default logger;
