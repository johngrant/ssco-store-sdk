function getTimestamp(): string {
  return new Date().toISOString();
}

const Logger = {
  log(message: string | object): void {
    if (typeof message === 'object') {
      console.log(`[LOG] ${getTimestamp()} ${JSON.stringify(message)}`);
    } else {
      console.log(`[LOG] ${getTimestamp()} ${message}`);
    }
  },

  info(message: string | object): void {
    if (typeof message === 'object') {
      console.info(`[INFO] ${getTimestamp()} ${JSON.stringify(message)}`);
    } else {
      console.info(`[INFO] ${getTimestamp()} ${message}`);
    }
  },
  
  warn(message: string | object): void {
    if (typeof message === 'object') {
      console.warn(`[WARN] ${getTimestamp()} ${JSON.stringify(message)}`);
    } else {
      console.warn(`[WARN] ${getTimestamp()} ${message}`);
    }
  },

  error(message: string | object): void {
    if (typeof message === 'object') {
      console.error(`[ERROR] ${getTimestamp()} ${JSON.stringify(message)}`);
    } else {
      console.error(`[ERROR] ${getTimestamp()} ${message}`);
    }
  },
};

export { Logger };