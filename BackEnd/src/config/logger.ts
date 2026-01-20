// Simple logger implementation without external dependencies
type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface Logger {
  error: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
}

const formatMessage = (level: LogLevel, message: string): string => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
};

const logger: Logger = {
  error: (message: string, ...args: unknown[]) => {
    console.error(formatMessage('error', message), ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(formatMessage('warn', message), ...args);
  },
  info: (message: string, ...args: unknown[]) => {
    console.info(formatMessage('info', message), ...args);
  },
  debug: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatMessage('debug', message), ...args);
    }
  },
};

export default logger;
