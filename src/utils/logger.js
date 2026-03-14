const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");
const fs = require("fs");

const createLogger = (Component) => {
  const logDir = "logs";

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const transport = new winston.transports.DailyRotateFile({
    filename: path.join(logDir, `${Component}-%DATE%.log`),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d",
  });

  const errorTransport = new winston.transports.DailyRotateFile({
    filename: path.join(logDir, `${Component}-error-%DATE%.log`),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d",
    level: "error",
  });

  const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    transports: [transport, errorTransport, new winston.transports.Console()],
  });

  return logger;
};

module.exports = createLogger;
