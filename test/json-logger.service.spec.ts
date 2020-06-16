import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { LOGGER, LOGGER_TYPE, LoggerInterface, LoggerModule } from '../lib';

describe('json-logger.service.spec', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule.forRoot({
          loggerType: LOGGER_TYPE.JSON_MODEL,
          loggerLevel: 'verbose',
          context: 'test',
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('test', () => {
    let log = app.get<'string', LoggerInterface>(LOGGER);
    log.info(JSON.stringify({ a: 1 }));
  });

  it('just print ', () => {
    let log = app.get<'string', LoggerInterface>(LOGGER);
    log.error('error', 'error.stack', 'error');
    log.warn('warn', 'warn');
    log.log('log', 'log');
    log.info('info', 'info');
    log.debug('debug', 'debug');
    log.verbose('verbose', 'verbose');
  });

  it('regex print', () => {
    const log = app.get<'string', LoggerInterface>(LOGGER);
    log.setLogLevel('error');

    // debug 默认不显示
    log.debug('x', '');
    log.setLogContextRegex(['test']);
    log.debug(JSON.stringify({ test: 'x' }), 'test');

    log.setLogContextRegex(['test1']);
    log.debug(JSON.stringify({ test: 'y' }), 'test');
    log.setLogContextRegex(['test2']);
    log.debug(JSON.stringify({ test: 'y' }), 'test');
    log.debug(JSON.stringify({ test: 'z' }), 'test2');
  });

  it('module init regex inject test', async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule.forRoot({
          loggerType: LOGGER_TYPE.JSON_MODEL,
          loggerLevel: 'error',
          context: 'test',
          loggerContextList: ['regex test'],
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const log = app.get<'string', LoggerInterface>(LOGGER);

    log.debug('test', 's');
    log.debug('test', 'regex test');
  });
});
