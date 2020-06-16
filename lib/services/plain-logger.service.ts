import { Logger } from '@nestjs/common';
import { LoggerLevel } from '../constant';
import { LoggerInterface, LoggerOptions } from '../interfaces';

const levelMap: { [key in LoggerLevel]: number } = {
  error: 0,
  warn: 1,
  log: 2,
  info: 2,
  debug: 3,
  verbose: 4,
};

export class PlainLoggerService extends Logger implements LoggerInterface {
  private loggerLevel: string;
  private loggerContextRegexList: RegExp[] = [];

  constructor(loggerOptions: LoggerOptions) {
    super(loggerOptions.context);
    this.loggerLevel = loggerOptions.loggerLevel || 'debug';
    this.setLogContextRegex(loggerOptions.loggerContextList);
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

  error(message: string, trace?: string, context?: string): void {
    if (!this.isPrint('error', context)) {
      return;
    }
    super.error(message, trace, context);
  }

  warn(message: string, context?: string): void {
    if (!this.isPrint('warn', context)) {
      return;
    }
    super.warn(message, context);
  }

  log(message: string, context?: string): void {
    if (!this.isPrint('log', context)) {
      return;
    }
    super.log(message, context);
  }

  info(message: string, context?: string): void {
    if (!this.isPrint('info', context)) {
      return;
    }
    super.log(message, context);
  }

  debug(message: string, context?: string): void {
    if (!this.isPrint('debug', context)) {
      return;
    }
    super.debug(message, context);
  }

  verbose(message: string, context?: string): void {
    if (!this.isPrint('verbose', context)) {
      return;
    }
    super.verbose(message, context);
  }

  setLogLevel(logLevel: string): void {
    this.loggerLevel = logLevel;
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
