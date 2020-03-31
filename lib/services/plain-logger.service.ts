import { Logger } from '@nestjs/common';
import { LoggerInterface } from '../interfaces';

type LevelTypes =
  | 'error'
  | 'warn'
  | 'log'
  | 'info'
  | 'verbose'
  | 'debug'
  | 'silly';

const level: { [key in string]: number } = {
  error: 0,
  warn: 1,
  log: 2,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5,
};

export class PlainLoggerService extends Logger implements LoggerInterface {
  private static level: string;
  private buffer: any[];

  constructor(context?: string) {
    super(context);
    PlainLoggerService.level = 'debug';
    this.buffer = [];
  }

  private prepare(message: any, context: any, outlevel: LevelTypes): void {
    if (this.buffer !== undefined) {
      this.buffer.push({ message, context, level: outlevel });
    }
  }

  getBuffer(): any[] | undefined {
    return this.buffer;
  }

  error(message: any, trace?: string, context?: string): void {
    if (level[PlainLoggerService.level] < 0) {
      return;
    }
    this.prepare(message, context, 'error');
    super.error(message, trace, context);
  }

  log(message: any, context?: string): void {
    if (level[PlainLoggerService.level] < 2) {
      return;
    }
    this.prepare(message, context, 'log');
    super.log(message, context);
  }

  info(message: any, context?: string): void {
    if (level[PlainLoggerService.level] < 2) {
      return;
    }
    this.prepare(message, context, 'info');
    super.log(message, context);
  }

  warn(message: any, context?: string): void {
    if (level[PlainLoggerService.level] < 1) {
      return;
    }
    this.prepare(message, context, 'warn');
    super.warn(message, context);
  }

  debug(message: any, context?: string): void {
    if (level[PlainLoggerService.level] < 4) {
      return;
    }
    this.prepare(message, context, 'debug');
    super.debug(message, context);
  }

  verbose(message: any, context?: string): void {
    if (level[PlainLoggerService.level] < 3) {
      return;
    }
    this.prepare(message, context, 'verbose');
    super.verbose(message, context);
  }

  setLogLevel(logLevel: string): void {
    PlainLoggerService.level = logLevel;
  }
}
