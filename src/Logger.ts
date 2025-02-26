function getTimestamp(): string {
  return new Date().toISOString();
}

function genericLog(level: "log" | "info" | "warn" | "error", message: string | object): void {
  const formattedMessage = typeof message === "object" ? JSON.stringify(message, null, 2) : message;
  console[level](`[${level.toUpperCase()}] ${getTimestamp()} ${formattedMessage}`);
}

const Logger = {
  log(message: string | object): void {
    genericLog("log", message);
  },

  info(message: string | object): void {
    genericLog("info", message);
  },

  warn(message: string | object): void {
    genericLog("warn", message);
  },

  error(message: string | object): void {
    genericLog("error", message);
  },
};

export { Logger };
