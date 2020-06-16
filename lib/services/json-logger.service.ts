import { LoggerLevel } from '../constant';
import { LoggerInterface, LoggerOptions } from '../interfaces';
import { LogLevel } from '@nestjs/common';

const levelMap: { [key in LoggerLevel]: number } = {
  error: 0,
  warn: 1,
  log: 2,
  info: 2,
  debug: 3,
  verbose: 4,
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
function CreateLogger() {}

['error', 'warn', 'log', 'info', 'debug', 'verbose'].map((method) => {
  CreateLogger.prototype[method] = (message: string, ...meta: any[]) => {
    const mObject =
      JSON.stringify(
        Object.assign(
          { timestamp: new Date().toISOString(), level: method, message },
          ...meta,
        ),
      ) + '\n';

    if (method === 'error') {
      process.stderr.write(mObject);
    } else {
      process.stdout.write(mObject);
    }
  };
});

export class JsonLoggerService implements LoggerInterface {
  private loggerLevel: LoggerLevel;
  private loggerContextRegexList: RegExp[] = [];

  private readonly context: string;
  public readonly logger = new CreateLogger();

  constructor(options: LoggerOptions) {
    this.context = options.context || 'UserScope';
    this.loggerLevel = options.loggerLevel || 'debug';
    this.setLogContextRegex(options.loggerContextList);
  }

  private static isJson(str: string): boolean {
    if (typeof str !== 'string') {
      return false;
    }
    return /^{|(^\[.*]$)/gi.test(str);
  }

  isPrint(level: LoggerLevel, context?: string): boolean {
    if (this.loggerContextRegexList.length >= 0) {
      for (const regex of this.loggerContextRegexList) {
        if (regex.test(context)) {
          return true;
        }
      }
    }
    return levelMap[this.loggerLevel] >= levelMap[level];
  }

  private static prepare(message: string): string {
    // 防止message字段答应出json结构，导致es解析失败
    return JsonLoggerService.isJson(message) ? '\\' + message : message;
  }

  error(message: string, trace?: string, context?: string): void {
    if (!this.isPrint('error', context)) {
      return;
    }

    const formatted = JsonLoggerService.prepare(message);
    const formattedTrace = JsonLoggerService.prepare(trace);
    this.logger.error(formatted, {
      context: context || this.context,
      formattedTrace,
    });
  }

  warn(message: string, context?: string): void {
    if (!this.isPrint('warn', context)) {
      return;
    }
    const formatted = JsonLoggerService.prepare(message);
    this.logger.warn(formatted, {
      context: context || this.context,
    });
  }

  log(message: string, context?: string): void {
    if (!this.isPrint('log', context)) {
      return;
    }
    const formatted = JsonLoggerService.prepare(message);
    this.logger.info(formatted, {
      context: context || this.context,
    });
  }

  info(message: string, context?: string): void {
    if (!this.isPrint('info', context)) {
      return;
    }
    const formatted = JsonLoggerService.prepare(message);
    this.logger.info(formatted, {
      context: context || this.context,
    });
  }

  debug(message: string, context?: string): void {
    if (!this.isPrint('debug', context)) {
      return;
    }
    const formatted = JsonLoggerService.prepare(message);
    this.logger.debug(formatted, {
      context: context || this.context,
    });
  }

  verbose(message: string, context?: string): void {
    if (!this.isPrint('verbose', context)) {
      return;
    }
    const formatted = JsonLoggerService.prepare(message);
    this.logger.verbose(formatted, {
      context: context || this.context,
    });
  }

  setLogLevel(level: LogLevel): void {
    this.loggerLevel = level;
  }

  setLogContextRegex(contextList: (string | RegExp | number)[] = []): void {
    this.loggerContextRegexList = contextList.reduce(
      (acc, context: string | RegExp) => {
        if (typeof context === 'string' || typeof context === 'number') {
          acc.push(new RegExp(context));
        } else if (context instanceof RegExp) {
          acc.push(context);
        } else {
          throw new Error('please input string or regex');
        }
        return acc;
      },
      [],
    );
  }
}
