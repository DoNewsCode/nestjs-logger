import * as winston from 'winston';
import { LoggerInterface } from '../interfaces';

const MESSAGE = Symbol.for('message');
const jsonFormatter = (logEntry: any) => {
  const base = { timestamp: new Date() };
  const json = Object.assign(base, logEntry);
  logEntry[MESSAGE] = JSON.stringify(json);
  return logEntry;
};

const myCustomLevels: { [key in keyof Partial<LoggerInterface>]: number } = {
  error: 0,
  warn: 1,
  info: 2, // log info 等价，但是因为winston 不允许log level。。。
  debug: 3,
  verbose: 4,
};

export class JsonLoggerService implements LoggerInterface {
  private readonly context: string;
  private static readonly transport = new winston.transports.Console();
  public static readonly logger = winston.createLogger({
    level: 'debug',
    levels: myCustomLevels,
    format: winston.format(jsonFormatter)(),
    transports: JsonLoggerService.transport,
  });

  constructor(context?: string) {
    this.context = context || 'UserScope';
  }

  private static isJson(str: string): boolean {
    if (typeof str !== 'string') {
      return false;
    }
    return /^{|(^\[.*]$)/gi.test(str);
  }

  private static prepare(message: string): string {
    // 防止message字段答应出json结构，导致es解析失败
    return JsonLoggerService.isJson(message) ? '\\' + message : message;
  }

  error(message: string, trace?: string, context?: string): void {
    const formatted = JsonLoggerService.prepare(message);
    const formattedTrace = JsonLoggerService.prepare(trace);
    JsonLoggerService.logger.error(formatted, {
      context: context || this.context,
      formattedTrace,
    });
  }

  warn(message: string, context?: string): void {
    const formatted = JsonLoggerService.prepare(message);
    JsonLoggerService.logger.warn(formatted, {
      context: context || this.context,
    });
  }

  log(message: string, context?: string): void {
    const formatted = JsonLoggerService.prepare(message);
    JsonLoggerService.logger.info(formatted, {
      context: context || this.context,
    });
  }

  info(message: string, context?: string): void {
    const formatted = JsonLoggerService.prepare(message);
    JsonLoggerService.logger.info(formatted, {
      context: context || this.context,
    });
  }

  debug(message: string, context?: string): void {
    const formatted = JsonLoggerService.prepare(message);
    JsonLoggerService.logger.debug(formatted, {
      context: context || this.context,
    });
  }

  verbose(message: string, context?: string): void {
    const formatted = JsonLoggerService.prepare(message);
    JsonLoggerService.logger.verbose(formatted, context || this.context);
  }

  setLogLevel(level: string): void {
    JsonLoggerService.logger.level = level;
  }
}
