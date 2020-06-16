export const LOGGER = Symbol.for('logger');
export const LOGGER_MODULE_OPTIONS = Symbol.for('LOGGER_MODULE_OPTIONS');

export enum LOGGER_TYPE {
  JSON_MODEL = 'json',
  PLAIN_MODEL = 'plain',
}

export type LoggerLevel =
  | 'error'
  | 'warn'
  | 'log'
  | 'info'
  | 'verbose'
  | 'debug';
