import { LoggerService, Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';

import { LOGGER_TYPE } from '../constant';

export interface LoggerInterface extends LoggerService {
  info(message: string, context?: string): void;
  error(message: string, trace?: string, context?: string): void;
}

export interface LoggerOptions {
  loggerType: LOGGER_TYPE;
  loggerLevel: string;
  context: string;
  loggerRegex: string | RegExp;
}

export interface LoggerOptionsFactory {
  createLoggerOptions(): Promise<LoggerOptions> | LoggerOptions;
}

export interface LoggerModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<LoggerOptionsFactory>;
  useClass?: Type<LoggerOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<LoggerOptions> | LoggerOptions;
  inject?: any[];
}
