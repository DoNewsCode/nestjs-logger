import { DonewsLoggerLevels, LoggerLevel } from '../constant';
import { LoggerInterface, LoggerOptions } from '../interfaces';
import { CommonUtil } from '../util/common.util';

export class JsonLoggerService implements LoggerInterface {
  private loggerLevel: LoggerLevel;
  private loggerContextRegexList: RegExp[] = [];

  private readonly context: string;

  constructor(options: LoggerOptions) {
    this.context = options.context || 'UserScope';
    this.setLogLevel(options.loggerLevel);
    this.setLogContextRegex(options.loggerContextList);
  }

  private static isJson(str: string): boolean {
    if (typeof str !== 'string') {
      return false;
    }
    return /^{|(^\[.*]$)/gi.test(str);
  }

  isPrint(level: LoggerLevel, context?: string): boolean {
    if (CommonUtil.checkContextByRegex(this.loggerContextRegexList, context)) {
      return true;
    }
    return DonewsLoggerLevels[this.loggerLevel] >= DonewsLoggerLevels[level];
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
    this.callFunction('error', formatted, {
      trace: formattedTrace,
      context: context || this.context,
    });
  }

  warn(message: string, context?: string): void {
    if (!this.isPrint('warn', context)) {
      return;
    }
    const formatted = JsonLoggerService.prepare(message);
    this.callFunction('warn', formatted, {
      context: context || this.context,
    });
  }

  log(message: string, context?: string): void {
    if (!this.isPrint('log', context)) {
      return;
    }
    const formatted = JsonLoggerService.prepare(message);
    this.callFunction('log', formatted, {
      context: context || this.context,
    });
  }

  info(message: string, context?: string): void {
    if (!this.isPrint('info', context)) {
      return;
    }
    const formatted = JsonLoggerService.prepare(message);
    this.callFunction('info', formatted, {
      context: context || this.context,
    });
  }

  debug(message: string, context?: string): void {
    if (!this.isPrint('debug', context)) {
      return;
    }
    const formatted = JsonLoggerService.prepare(message);
    this.callFunction('debug', formatted, {
      context: context || this.context,
    });
  }

  verbose(message: string, context?: string): void {
    if (!this.isPrint('verbose', context)) {
      return;
    }
    const formatted = JsonLoggerService.prepare(message);
    this.callFunction('verbose', formatted, {
      context: context || this.context,
    });
  }

  callFunction(method: string, message: string, ...meta: any[]): void {
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
  }

  setLogLevel(logLevel: LoggerLevel): void {
    this.loggerLevel = CommonUtil.checkLogLevel(logLevel);
  }

  setLogContextRegex(contextList: string | RegExp | (string | RegExp)[]): void {
    this.loggerContextRegexList = CommonUtil.generateContextRegexList(
      contextList,
    );
  }
}
