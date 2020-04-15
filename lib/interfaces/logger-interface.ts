import { LoggerService, Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';

export interface LoggerInterface extends LoggerService {
  info(message: string, context?: string): void;
  error(message: string, trace?: string, context?: string): void;
  getBuffer(): any[] | undefined;
}

export interface LoggerOptions {
  loggerType: 'json' | 'plain';
  loggerLevel: string;
  context: string;
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
