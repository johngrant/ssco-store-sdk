function getTimestamp(): string {
  return new Date().toISOString();
}

const Logger = {
  log(message: string): void {
    console.log(`[LOG] ${getTimestamp()} ${message}`);
  },

  info(message: string): void {
    console.info(`[INFO] ${getTimestamp()} ${message}`);
  },

  warn(message: string): void {
    console.warn(`[WARN] ${getTimestamp()} ${message}`);
  },

  error(message: string): void {
    console.error(`[ERROR] ${getTimestamp()} ${message}`);
  }
};

export { Logger };